import { selectElementsProps } from 'pages/Home/OfficeElement/ElementPropsStatic'
import { GroupBase } from 'react-select'
import CreatableSelect, { CreatableProps } from 'react-select/creatable'
import { StateManagerProps } from 'react-select/dist/declarations/src/useStateManager'
import Select from './Select'

type SelectElementProps = {
  onChange: (value: any) => void
  selectType: 'select' | 'createSelect'
} & StateManagerProps<any, false, GroupBase<any>> &
  CreatableProps<any, false, GroupBase<any>>

const SelectElement = ({ ...props }: SelectElementProps) => {
  const isError = false
  const allProps = {
    ...props,
    ...selectElementsProps,
    onChange: (value: any) => {
      props.onChange(value)
    },
    className: 'element-props__select',
    classNames: {
      control: () => {
        return isError ? 'element-props__select--error' : ''
      },
      ...selectElementsProps.classNames,
    },
  }

  return (
    <div className={`select-container ${props.className}`}>
      {props.selectType === 'select' ? (
        <Select {...allProps} />
      ) : (
        <CreatableSelect {...allProps} />
      )}

      {isError && <span className="element-props__error--msg">{'asdfas'}</span>}
    </div>
  )
}

export default SelectElement
