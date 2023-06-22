import { getElements, saveElement } from 'api/api'
import Button from 'components/Button'
import { Form, Formik } from 'formik'
import { isEqual } from 'lodash'
import { TemplateContext } from 'pages/Home/Home'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import { Element, ElementStruct } from 'types/types'
import { pipeComponents } from 'utils/utils'
import { v4 as uuid } from 'uuid'
import ElementCompHOC from '../ElementCompHOC'
import { complexListItemOptions, typeOptions } from '../ElementPropsStatic'
import ChooseElement from './ChooseElement'
import { ChooseType } from './ChooseType'
import { useIsCCPartOfComplexList } from './OfficeElementHooks'
import officeSchema from './OfficeElementSchema'

import '../OfficeElement.styles.scss'

// TODO MAYBE IN FUTURE CREATE TEXTAREA FIELD FOR CHOOSING AND ADDING NEW FLAGS
// TODO element.Struct.case exist for every element should be existing only for input elements
// const Input = (props: InputProps<any, true>) => {
//   console.log(props)
//   return (
//     <>
//       {/*@ts-ignore*/}
//       <textarea {...props}>{props.value}</textarea>
//     </>
//   )
// }

const initialValues = {
  chooseElement: '',
}

export const defaultElementStruct: ElementStruct = {
  typeId: 4,
  case: 0,
  struct: [],
  docs: [],
  displayConditions: [],
  isHidden: false,
  parentName: null,
}

export const defaultElement: Partial<Element> = {
  Struct: defaultElementStruct,
  Type: '4',
  Title: '',
  isChanged: null,
}

type ElementContextType<T> = {
  data: T
  setData: (data: T | ((data: T) => T)) => void
}

export const ElementStructContext = createContext<
  ElementContextType<ElementStruct>
>({
  data: defaultElementStruct,
  setData: () => undefined,
})

export const ControlContext = createContext(null)
export const ElementsContext = createContext<Element[]>([])
export const CurrentElementContext =
  createContext<ElementContextType<Partial<Element>>>(null)

export default ({ categoryId }: { categoryId: string }) => {
  const templates = useContext(TemplateContext)
  const templateIds = useMemo(
    () => templates?.map((template) => template.Id),
    [templates]
  )
  const [noOptionsMsg, setNoOptionsMsg] = useState('Пусто :(')
  const localElements = JSON.parse(localStorage.getItem('elements'))
  const [elementsData, setElementsData] = useState<Element[]>(
    localElements || []
  )
  const [currentElement, setCurrentElement] = useState(defaultElement)
  const defaultElementData = useRef(defaultElement)
  const elementStruct = useMemo(
    () => currentElement.Struct,
    [currentElement.Struct]
  )

  const [propsIsActive, setPropsIsActive] = useState(false)

  const addElement = () => {
    // TODO multiple elements has same ids so i need to use title
    // TODO in cc tag stored full struct of element, it's vulnerable to bugs
    const tag: any = {
      elementTitle: null,
      parentId: null,
      ...defaultElementStruct,
    }
    setCurrentElement(defaultElement)
    if (currentControl) {
      tag.parentId = currentControl.InternalId
    }
    Asc.plugin.executeMethod('AddContentControl', [
      1,
      {
        Id: uuid(),
        Tag: JSON.stringify(tag),
        Lock: 3,
        PlaceHolderText: 'название...',
      },
    ])
  }

  const elements = useMutation(getElements, {
    onSuccess: (data) => {
      setElementsData((prevData) => {
        const newValues = []
        for (const item of data) {
          // TODO why type 5 is excluded?
          // TODO why i compare titles?
          // I compare titles because there is no id. Unique elements is determined by title
          if (!prevData.find((i: any) => i.Title === item.Title)) {
            // TODO item.Struct string or object should be only object
            if (typeof item.Struct === 'string') {
              item.Struct = JSON.parse(item.Struct)
            }
            newValues.push(item)
          }
        }
        return [...prevData, ...newValues]
      })
    },
    onError: () => {
      setNoOptionsMsg('В данном шаблоне нет элементов!')
    },
  })

  const [currentControl, setCurrentControl] = useState(null)

  const isCCPartOfComplexList = useIsCCPartOfComplexList(
    currentControl,
    elementsData
  )

  const elementStructTypeOption = useMemo(
    () =>
      (isCCPartOfComplexList ? complexListItemOptions : typeOptions).find(
        (option) => option.type === elementStruct?.typeId
      ),
    [elementStruct?.typeId, isCCPartOfComplexList]
  )

  const ElementComp = useMemo(() => {
    const typeOption = typeOptions.find(
      (option) => option.type === elementStructTypeOption?.type
    )
    if (typeOption) {
      return ElementCompHOC(typeOption.Component, typeOption.type)
    }
    return () => <></>
  }, [elementStructTypeOption])

  useMemo(() => {
    const elementTitle = JSON.parse(currentControl?.Tag || '{}')?.elementTitle
    const element = elementsData.find(
      (element) => element.Title === elementTitle
    )
    if (element) {
      setCurrentElement(element)
      defaultElementData.current = element
    } else {
      setCurrentElement(defaultElement)
      defaultElementData.current = defaultElement
    }
  }, [currentControl?.Tag])

  useEffect(() => {
    Asc.plugin.event_onFocusContentControl = (control: any) => {
      setPropsIsActive(true)
      setCurrentControl(control)
      console.log(control)
    }
    Asc.plugin.event_onBlurContentControl = (_: any) => {
      setPropsIsActive(false)
      setCurrentControl(null)
    }
  }, [])

  const fetchElements = useCallback(() => {
    setElementsData([])
    if (templateIds?.length) {
      for (const id of templateIds) {
        // TODO I have to send request on every item in array should be one request
        elements.mutate(id)
      }
    }
  }, [templateIds])

  useEffect(() => {
    fetchElements()
  }, [fetchElements])

  const saveElements = () => {
    const prevElements = JSON.parse(localStorage.getItem('elements')) || []
    if (
      !elementsData.find((element) => element.Title === currentElement.Title)
    ) {
      localStorage.setItem(
        'elements',
        JSON.stringify([...prevElements, currentElement])
      )
      setElementsData((prev) => [...prev, currentElement as Element])
    } else {
      setElementsData((prev) => {
        let index: number | null = null
        prev.forEach((element, i) => {
          if (element.Title === currentElement.Title) {
            index = i
          }
        })
        return [
          ...prev.slice(0, index),
          currentElement as Element,
          ...prev.slice(index + 1),
        ]
      })
    }
  }

  const changeCurrentElementTag = () => {
    window.Asc.plugin.executeMethod(
      'GetCurrentContentControlPr',
      [],
      function (obj: any) {
        const tag = JSON.parse(obj.Tag)
        Asc.plugin.executeMethod('InsertAndReplaceContentControls', [
          [
            {
              Props: {
                Id: uuid(),
                Lock: 3,
                Tag: JSON.stringify({
                  ...tag,
                  ...currentElement.Struct,
                  ...(currentElement.Struct.typeId === 9 && {
                    elementTitle: 'номер',
                  }),
                }),
                InternalId: obj.InternalId,
                Alias: currentElement.Title,
              },
            },
          ],
        ])
      }
    )
  }

  const elementChanges = useMutation(saveElement, {
    onSuccess: (_) => {
      toast.success('Сохранено успешно!')
      changeCurrentElementTag()
      saveElements()
      defaultElementData.current = currentElement
    },
    onError: (_) => {
      toast.error('Не удалось сохранить изменения!')
    },
  })

  const saveChanges = () => {
    if (currentElement.Type === '9') {
      toast.success('Сохранено успешно!')
      changeCurrentElementTag()
      saveElements()
    } else {
      elementChanges.mutate({
        categoryId,
        struct: JSON.stringify(currentElement.Struct),
        title: currentElement.Title,
      })
    }
  }

  const setElementStruct = (
    struct: ElementStruct | ((prev: ElementStruct) => ElementStruct)
  ) => {
    if (typeof struct === 'function') {
      setCurrentElement((prev) => ({ ...prev, Struct: struct(prev.Struct) }))
    } else {
      setCurrentElement((prev) => ({ ...prev, Struct: struct }))
    }
  }

  const fieldDisabled =
    !templateIds?.length || elementChanges.isLoading || !elementsData?.length

  return (
    <>
      <h2 className="office-element__title">Свойства элемента:</h2>
      {!templateIds?.length && (
        <p className="warning-msg">
          Выберите категорию для редактирования элемента!
        </p>
      )}
      <Formik
        initialValues={initialValues}
        onSubmit={saveChanges}
        validationSchema={officeSchema}
      >
        <Form>
          {true && (
            <fieldset
              className="office-element__fieldset"
              disabled={fieldDisabled}
            >
              {pipeComponents(
                { Component: ElementsContext, value: elementsData },
                {
                  Component: CurrentElementContext,
                  value: { data: currentElement, setData: setCurrentElement },
                }
              )(
                <ChooseElement
                  noOptionsMsg={noOptionsMsg}
                  isCCPartOfComplexList={isCCPartOfComplexList}
                  elementStructTypeOption={elementStructTypeOption}
                  name="chooseElement"
                />
              )}

              <p style={{ marginBottom: 5 }}>Тип Элемента:</p>

              <CurrentElementContext.Provider
                value={{ data: currentElement, setData: setCurrentElement }}
              >
                <ChooseType
                  isCCPartOfComplexList={isCCPartOfComplexList}
                  elementStructTypeOption={elementStructTypeOption}
                />
              </CurrentElementContext.Provider>

              {pipeComponents(
                { Component: ControlContext, value: currentControl },
                { Component: ElementsContext, value: elementsData },
                {
                  Component: ElementStructContext,
                  value: { data: elementStruct, setData: setElementStruct },
                }
              )(<ElementComp />)}

              <Button
                type="submit"
                className="submit"
                style={{ marginTop: 20 }}
                disabled={isEqual(defaultElementData.current, currentElement)}
              >
                Сохранить изменения
              </Button>
            </fieldset>
          )}

          <Button className="office-element__btn submit" onClick={addElement}>
            Создать элемент
          </Button>
        </Form>
      </Formik>
    </>
  )
}
