import { FieldAttributes, useField } from 'formik'
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
} & FieldAttributes<any>

const ChooseElement = ({
  noOptionsMsg,
  isCCPartOfComplexList,
  elementStructTypeOption,
  ...props
}: ChooseElementProps) => {
  const [field, meta, helper] = useField(props)

  const elementsData = useContext(ElementsContext)
  const currentElement = useContext(CurrentElementContext)

  const changeElement = (option: Element) => {
    helper.setValue(option.Title)
    // Asc.plugin.executeMethod(
    //   'GetCurrentContentControlPr',
    //   [],
    //   function (obj: any) {
    //     const tag = JSON.parse(obj.Tag)
    //     tag.elementTitle = option.Title
    //     Asc.plugin.executeMethod('InsertAndReplaceContentControls', [
    //       [
    //         {
    //           Props: {
    //             Id: uuid(),
    //             Lock: 3,
    //             Tag: JSON.stringify(tag),
    //             InternalId: obj.InternalId,
    //             Alias: option.Title,
    //           },
    //         },
    //       ],
    //     ])
    //   }
    // )
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
    <div className="select-container">
      {currentElement.data.Type !== '9' && (
        <CreatableSelect
          {...field}
          {...props}
          {...selectElementsProps}
          noOptionsMessage={() => noOptionsMsg}
          options={selectOptions}
          className="element-props__select"
          onChange={(option: Element) => changeElement(option)}
          value={selectValue}
          getNewOptionData={getNewOption}
          classNames={{
            control: () => {
              return meta.error && 'element-props__select--error'
            },
            ...selectElementsProps.classNames,
          }}
        />
      )}
      {meta.touched && meta.error && (
        <span className="element-props__error--msg">{meta.error}</span>
      )}
    </div>
  )
}
export default ChooseElement
