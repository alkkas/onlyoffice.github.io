import Select from 'components/Select'
import { useContext } from 'react'
import { Element } from 'types/types'
import { CurrentElementContext, defaultElement } from '.'
import {
  complexListItemOptions,
  typeOptions,
  typeOptionsType,
} from '../ElementPropsStatic'

type ChooseTypeProps = {
  isCCPartOfComplexList: boolean
  elementStructTypeOption: typeOptionsType
}

export const ChooseType = ({
  isCCPartOfComplexList,
  elementStructTypeOption,
}: ChooseTypeProps) => {
  const currentElement = useContext(CurrentElementContext)

  const changeValue = (option: typeOptionsType) => {
    currentElement.setData((prev) => {
      if (option.type === 9) {
        return {
          ...defaultElement,
          Type: option.type.toString() as Element['Type'],
          Title: 'номер',
          Struct: { ...defaultElement.Struct, typeId: 9 },
        }
      }
      return {
        ...prev,
        Type: option.type.toString() as Element['Type'],
        Struct: {
          ...prev.Struct,
          typeId: option.type,
        },
      }
    })
  }

  const options = isCCPartOfComplexList ? complexListItemOptions : typeOptions

  return (
    <Select
      options={options}
      value={elementStructTypeOption}
      //TODO two option type should be one
      onChange={changeValue}
      getOptionValue={(option) => option.type}
      isSearchable={false}
    />
  )
}
