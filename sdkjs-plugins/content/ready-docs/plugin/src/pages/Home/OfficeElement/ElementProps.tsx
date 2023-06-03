import { getElements } from 'api/api'
import Button from 'components/Button'
import Select from 'components/Select'
import { TemplateContext } from 'pages/Home/Home'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useMutation } from 'react-query'
import CreatableSelect from 'react-select/creatable'
import { Element, ElementStruct } from 'types/types'
import ElementCompHOC from './ElementCompHOC'
import { selectFlagsProps, typeOptions } from './ElementPropsStatic'
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
  parentName: '',
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

export default () => {
  const templates = useContext(TemplateContext)
  const templateIds = useMemo(
    () => templates?.map((template) => template.Id),
    [templates]
  )
  const [elementsData, setElementsData] = useState<Element[]>([])
  const [noOptionsMsg, setNoOptionsMsg] = useState('Пусто :(')
  const [elementStruct, setElementStruct] = useState(defaultElementStruct)
  const elementStructType = useMemo(
    () => typeOptions.find((option) => option.type === elementStruct.typeId),
    [elementStruct.typeId]
  )

  const ElementComp = useMemo(() => {
    const typeOption = typeOptions.find(
      (option) => option.type === elementStructType.type
    )
    if (typeOption) {
      return ElementCompHOC(typeOption.Component, typeOption.type)
    }
    return () => <></>
  }, [elementStructType])

  const elements = useMutation(getElements, {
    onSuccess: (data) => {
      setElementsData((prevData) => {
        const newValues = []
        for (const item of data) {
          // TODO why type 5 is excluded?
          // TODO why i compare titles?
          // I compare titles because there is no id. Unique elements is determined by title
          if (
            !prevData.find((i: any) => i.Title === item.Title) &&
            item.Type !== '5'
          ) {
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

  useEffect(() => {
    if (templateIds?.length) {
      for (const id of templateIds) {
        // TODO I have to send request on every item in array should be one request
        elements.mutate(id)
      }
    } else {
      setElementsData([])
    }
  }, [elements.mutate, templateIds])
  console.log(elementStruct)
  return (
    <>
      <h2 className="office-element__title">Свойства элемента:</h2>
      {!templateIds?.length && (
        <p className="warning-msg">
          Выберите категорию для редактирования элемента!
        </p>
      )}
      <fieldset
        className="office-element__fieldset"
        disabled={!templateIds?.length}
      >
        <CreatableSelect
          noOptionsMessage={() => noOptionsMsg}
          options={elementsData}
          className="element-props__select"
          onChange={(option) => setElementStruct(option.Struct)}
          {...selectFlagsProps}
        />

        <p style={{ marginBottom: 5 }}>Тип Элемента:</p>
        <Select
          options={typeOptions}
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
        <Button className="submit" style={{ marginTop: 20 }}>
          Сохранить изменения
        </Button>
      </fieldset>
    </>
  )
}
