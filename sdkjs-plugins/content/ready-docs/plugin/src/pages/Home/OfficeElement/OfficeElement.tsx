import { getElements, saveElement } from 'api/api'
import Button from 'components/Button'
import Select from 'components/Select'
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
import CreatableSelect from 'react-select/creatable'
import { toast } from 'react-toastify'
import { Element, ElementStruct } from 'types/types'
import { v4 as uuid } from 'uuid'
import ElementCompHOC from './ElementCompHOC'
import {
  complexListItemOptions,
  selectElementsProps,
  typeOptions,
} from './ElementPropsStatic'

import './OfficeElement.styles.scss'

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

const defaultElementStruct: ElementStruct = {
  typeId: 4,
  case: 0,
  struct: [],
  docs: [],
  displayConditions: [],
  isHidden: false,
  parentName: null,
}

const defaultElement: Partial<Element> = {
  Struct: defaultElementStruct,
  Type: '4',
  Title: '',
  isChanged: null,
}

type ElementStructContext = {
  data: ElementStruct
  setData: (
    data: ElementStruct | ((data: ElementStruct) => ElementStruct)
  ) => void
}

export const ElementStructContext = createContext<ElementStructContext>({
  data: defaultElementStruct,
  setData: () => undefined,
})

export const ElementsContext = createContext<Element[]>([])

export default ({ categoryId }: { categoryId: string }) => {
  const templates = useContext(TemplateContext)
  const templateIds = useMemo(
    () => templates?.map((template) => template.Id),
    [templates]
  )
  const [noOptionsMsg, setNoOptionsMsg] = useState('Пусто :(')

  const [elementsData, setElementsData] = useState<Element[]>([])
  const [currentElement, setCurrentElement] = useState(defaultElement)
  console.log(currentElement)
  const defaultElementData = useRef(defaultElement)
  const elementStruct = useMemo(
    () => currentElement.Struct,
    [currentElement.Struct]
  )

  const [propsIsActive, setPropsIsActive] = useState(false)

  const addElement = () => {
    const tag: any = { elementTitle: null, parentId: null }
    if (currentControl) {
      tag.parentId = currentControl.InternalId
    }
    window.Asc.plugin.executeMethod('AddContentControl', [
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

  const [isCCPartOfComplexList, setCCPartOfComplexList] = useState(false)
  useMemo(() => {
    const tag = JSON.parse(currentControl?.Tag || '{}')
    let isParentComplexList = false
    if (Asc?.plugin?.executeMethod) {
      Asc.plugin.executeMethod(
        'GetAllContentControls',
        null,
        function (data: any) {
          data.forEach((item: any) => {
            if (item.InternalId === tag?.parentId) {
              const itemTag = JSON.parse(item.Tag)
              const isItemComplexList =
                elementsData.find(
                  (element) => element?.Title === itemTag.elementTitle
                )?.Type === '8'
              if (isItemComplexList) {
                isParentComplexList = true
              }
            }
          })
          setCCPartOfComplexList(isParentComplexList)
        }
      )
    }
  }, [currentControl])

  const elementStructType = useMemo(
    () =>
      (isCCPartOfComplexList ? complexListItemOptions : typeOptions).find(
        (option) => option.type === elementStruct?.typeId
      ),
    [elementStruct?.typeId]
  )

  const ElementComp = useMemo(() => {
    const typeOption = typeOptions.find(
      (option) => option.type === elementStructType?.type
    )
    if (typeOption) {
      return ElementCompHOC(typeOption.Component, typeOption.type)
    }
    return () => <></>
  }, [elementStructType])

  useMemo(() => {
    const elementTitle = JSON.parse(currentControl?.Tag || '{}')?.elementTitle
    const element = elementsData.find(
      (element) => element.Title === elementTitle
    )
    if (element) {
      setCurrentElement(element)
      defaultElementData.current = element
    }
  }, [currentControl?.Tag])

  useEffect(() => {
    Asc.plugin.event_onFocusContentControl = function (control: any) {
      console.log(control)
      setPropsIsActive(true)
      setCurrentControl(control)
    }
    Asc.plugin.event_onBlurContentControl = (control: any) => {
      setPropsIsActive(false)
      setCurrentControl(null)
    }
  }, [])

  const fetchElements = useCallback(() => {
    if (templateIds?.length) {
      for (const id of templateIds) {
        // TODO I have to send request on every item in array should be one request
        elements.mutate(id)
      }
    } else {
      setElementsData([])
    }
  }, [templateIds, elements.mutate])

  useEffect(() => {
    fetchElements()
  }, [fetchElements])

  const changeElement = (option: Element) => {
    defaultElementData.current = option
    Asc.plugin.executeMethod(
      'GetCurrentContentControlPr',
      [],
      function (obj: any) {
        const tag = JSON.parse(obj.Tag)
        tag.elementTitle = option.Title
        Asc.plugin.executeMethod('InsertAndReplaceContentControls', [
          [
            {
              Props: {
                Id: uuid(),
                Lock: 3,
                Tag: JSON.stringify(tag),
                InternalId: obj.InternalId,
                Alias: option.Title,
              },
            },
          ],
        ])
      }
    )
    setCurrentElement(option)
  }

  const elementChanges = useMutation(saveElement, {
    onSuccess: (_) => {
      toast.success('Сохранено успешно!')
      setElementsData([])
      fetchElements()
      defaultElementData.current = currentElement
    },
    onError: (_) => {
      toast.error('Не удалось сохранить изменения!')
    },
  })

  const saveChanges = () => {
    elementChanges.mutate({
      categoryId,
      struct: JSON.stringify(currentElement.Struct),
      title: currentElement.Title,
    })
  }

  const setElementStruct = (
    struct: ElementStruct | ((prev: ElementStruct) => ElementStruct)
  ) => {
    console.log(currentElement)
    if (typeof struct === 'function') {
      setCurrentElement((prev) => ({ ...prev, Struct: struct(prev.Struct) }))
    } else {
      setCurrentElement((prev) => ({ ...prev, Struct: struct }))
    }
  }

  return (
    <>
      <h2 className="office-element__title">Свойства элемента:</h2>
      {!templateIds?.length && (
        <p className="warning-msg">
          Выберите категорию для редактирования элемента!
        </p>
      )}
      {propsIsActive && (
        <fieldset
          className="office-element__fieldset"
          disabled={
            !templateIds?.length ||
            elementChanges.isLoading ||
            !elementsData?.length
          }
        >
          <CreatableSelect
            noOptionsMessage={() => noOptionsMsg}
            options={
              !isCCPartOfComplexList
                ? elementsData
                : elementsData.filter((item) => item?.Type === '4')
            }
            className="element-props__select"
            onChange={(option) => changeElement(option)}
            value={elementsData.find(
              (element) => element.Id === currentElement?.Id
            )}
            getNewOptionData={(_: string, optionLabel: string) => ({
              Title: optionLabel,
              Id: uuid(),
              Struct: defaultElementStruct,
              Type: elementStructType?.type,
              isChanged: null,
            })}
            {...selectElementsProps}
          />

          <p style={{ marginBottom: 5 }}>Тип Элемента:</p>
          <Select
            options={
              isCCPartOfComplexList ? complexListItemOptions : typeOptions
            }
            value={elementStructType}
            onChange={(option) =>
              setElementStruct((prev) => ({ ...prev, typeId: option.type }))
            }
            getOptionValue={(option) => option.type}
            isSearchable={false}
          />
          <ElementsContext.Provider value={elementsData}>
            <ElementStructContext.Provider
              value={{ data: elementStruct, setData: setElementStruct }}
            >
              <ElementComp />
            </ElementStructContext.Provider>
          </ElementsContext.Provider>

          <Button
            className="submit"
            style={{ marginTop: 20 }}
            onClick={saveChanges}
            disabled={isEqual(defaultElementData.current, currentElement)}
          >
            Сохранить изменения
          </Button>
        </fieldset>
      )}

      <Button className="office-element__btn submit" onClick={addElement}>
        Создать элемент
      </Button>
    </>
  )
}
