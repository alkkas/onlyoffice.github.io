import { useContext } from 'react'
import CreatableSelect from 'react-select/creatable'
import { Element } from 'types/types'
import { v4 as uuid } from 'uuid'
import { CurrentElementContext, ElementsContext } from '.'
import { selectElementsProps, typeOptionsType } from '../ElementPropsStatic'
import { defaultElementStruct } from './index'

type ChooseElementProps = {
  noOptionsMsg: string
  isCCPartOfComplexList: boolean
  elementStructTypeOption: typeOptionsType
}

const ChooseElement = ({
  noOptionsMsg,
  isCCPartOfComplexList,
  elementStructTypeOption,
}: ChooseElementProps) => {
  const elementsData = useContext(ElementsContext)
  const currentElement = useContext(CurrentElementContext)

  const changeElement = (option: Element) => {
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
    currentElement.setData(option)
  }

  const selectOptions = !isCCPartOfComplexList
    ? elementsData.filter((item) => item?.Type !== '9')
    : elementsData.filter((item) => item?.Type !== '9' && item?.Type === '4')

  const selectValue = elementsData.find(
    (element) => element.Id === currentElement.data?.Id && element?.Type !== '9'
  )

  const getNewOption = (_: string, optionLabel: string) => ({
    Title: optionLabel,
    Id: uuid(),
    Struct: defaultElementStruct,
    Type: elementStructTypeOption?.type,
    isChanged: null as string,
  })

  return (
    <>
      {currentElement.data.Type !== '9' && (
        <CreatableSelect
          noOptionsMessage={() => noOptionsMsg}
          options={selectOptions}
          className="element-props__select"
          onChange={(option) => changeElement(option)}
          value={selectValue}
          getNewOptionData={getNewOption}
          {...selectElementsProps}
        />
      )}
    </>
  )
}
export default ChooseElement
