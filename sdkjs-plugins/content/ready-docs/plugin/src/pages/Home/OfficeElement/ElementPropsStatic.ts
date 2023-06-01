//new api should be not number but strings
//input text radio checkbox complexList
// 4 = input
// 5 = text
// 6 = radio
// 7 = checkbox
// 8 = complexList
import InputField from 'pages/Home/OfficeElement/elementComponents/InputField'
import Text from 'pages/Home/OfficeElement/elementComponents/Text'
import RadioInput from 'pages/Home/OfficeElement/elementComponents/RadioInput'
import CheckboxInput from 'pages/Home/OfficeElement/elementComponents/CheckboxInput'
import UnfixedList from 'pages/Home/OfficeElement/elementComponents/UnfixedList'
import { v4 as uuid } from 'uuid'

export type typeOptionsType = {
  type: 4 | 5 | 6 | 7 | 8
  label: string
  Component: () => JSX.Element
}

export const typeOptions: typeOptionsType[] = [
  { type: 4, label: 'Поле для ввода', Component: InputField },
  { type: 5, label: 'Текст', Component: Text },
  { type: 6, label: 'Выбор', Component: RadioInput },
  { type: 7, label: 'Список', Component: CheckboxInput },
  {
    type: 8,
    label: 'Нефиксированный список',
    Component: UnfixedList,
  },
]
export const colors = {
  4: 'light-orange',
  5: 'light-green',
  6: 'light-blue',
  7: 'light-yellow',
  8: 'light-red',
  9: 'light-pink',
}

export const selectFlagsProps = {
  placeholder: 'Название элемента',
  loadingMessage: () => 'Загрузка...',
  getOptionLabel: (option: any) => option.Title,
  getOptionValue: (option: any) => option.Id,
  formatCreateLabel: (input: string) => `создать ${input}`,
  getNewOptionData: (inputValue: string, optionLabel: string) => ({
    Title: optionLabel,
    Id: uuid(),
    Struct: {},
  }),

  styles: {
    option: (base: any, state: any) => ({
      ...base,
      background: `var(--${
        colors[state.data.Type as keyof typeof colors] || 'light-blue'
      })`,
    }),
  },
  classNames: {
    option: ({ isSelected }: { isSelected: boolean }) => {
      return `element-props__option ${
        isSelected && 'element-props__option--selected'
      }`
    },
  },
}
