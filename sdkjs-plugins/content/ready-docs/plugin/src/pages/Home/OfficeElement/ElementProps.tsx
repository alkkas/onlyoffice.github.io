import { createContext, useMemo, useState } from 'react'
import Select from 'components/Select'
import CreatableSelect from 'react-select/creatable'
import { useMutation } from 'react-query'
import { getElements } from 'api/api'
import { useContext, useEffect } from 'react'
import { TemplateIdContext } from 'pages/Home/Home'
import Text from 'pages/Home/OfficeElement/elementComponents/Text'
import InputField from 'pages/Home/OfficeElement/elementComponents/InputField'
import RadioInput from 'pages/Home/OfficeElement/elementComponents/RadioInput'
import CheckboxInput from 'pages/Home/OfficeElement/elementComponents/CheckboxInput'
import UnfixedList from 'pages/Home/OfficeElement/elementComponents/UnfixedList'
import ElementCompHOC from 'pages/Home/OfficeElement/ElementCompHOC'

//new api should be not number but strings
//input text radio checkbox complexList

export type typeOptionsType = {
  type: 4 | 'text' | 'radio' | 'checkbox' | 'complexList'
  label: string
  Component: () => JSX.Element
}

const typeOptions: typeOptionsType[] = [
  { type: 4, label: 'Поле для ввода', Component: InputField },
  { type: 'text', label: 'Текст', Component: Text },
  { type: 'radio', label: 'Выбор', Component: RadioInput },
  { type: 'checkbox', label: 'Список', Component: CheckboxInput },
  {
    type: 'complexList',
    label: 'Нефиксированный список',
    Component: UnfixedList,
  },
]

const colors = {
  4: 'light-orange',
  5: 'light-green',
  6: 'light-blue',
  7: 'light-yellow',
  8: 'light-red',
  9: 'light-pink',
}

export const ElementContext = createContext<any>({})

export default () => {
  const templateIds = useContext(TemplateIdContext)
  const [elementsData, setElementsData] = useState<any[]>([])
  const [noOptionsMsg, setNoOptionsMsg] = useState('Пусто :(')
  const [selectedType, setSelectedType] = useState<any>(typeOptions[0])
  const [elementStruct, setElementStruct] = useState<any>({})

  const ElementComp = useMemo(() => {
    const typeOption = typeOptions.find(
      (option) => option.type === selectedType.type
    )
    if (typeOption) {
      return ElementCompHOC(typeOption.Component, typeOption.type)
    }
    return () => <></>
  }, [selectedType])

  const elements = useMutation(getElements, {
    onSuccess: (data) => {
      setElementsData((prevData) => {
        const newValues = []
        for (const item of data) {
          // TODO why type 5 is excluded?
          // TODO why i compare titles?
          if (
            !prevData.find((i: any) => i.Title === item.Title) &&
            item.Type !== '5'
          ) {
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
  return (
    <>
      <h2 className="office-element__title">Свойства элемента:</h2>
      {!templateIds?.length && (
        <p className="warning-msg">
          Выберите категорию для редактирования элемента!
        </p>
      )}
      <CreatableSelect
        placeholder="Название элемента"
        loadingMessage={() => 'Загрузка...'}
        noOptionsMessage={() => noOptionsMsg}
        options={elementsData}
        getOptionLabel={(option) => option.Title}
        getOptionValue={(option) => option.Id}
        onChange={(option) => setElementStruct(JSON.parse(option.Struct))}
        className="element-props__select"
        isDisabled={!templateIds?.length}
        styles={{
          option: (base, state) => ({
            ...base,
            background: `var(--${
              colors[state.data.Type as keyof typeof colors]
            })`,
          }),
        }}
        classNames={{
          option: ({ isSelected }) => {
            return `element-props__option ${
              isSelected && 'element-props__option--selected'
            }`
          },
        }}
      />

      <Select
        placeholder="тип элемента"
        options={typeOptions}
        defaultValue={typeOptions.find((option) => option.type === 'input')}
        getOptionValue={(option) => option.type}
        onChange={(option) => setSelectedType(option)}
        isDisabled={!templateIds?.length}
      />

      <ElementContext.Provider
        value={{ data: elementStruct, setData: setElementStruct }}
      >
        <ElementComp />
      </ElementContext.Provider>
    </>
  )
}
