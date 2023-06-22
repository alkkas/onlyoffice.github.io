import { FieldAttributes, useField } from 'formik'
import { selectElementsProps } from 'pages/Home/OfficeElement/ElementPropsStatic'
import CreatableSelect from 'react-select/creatable'

type SelectElementType = {
  onChange: () => void
  className: string
} & FieldAttributes<any>

const SelectElement = ({ ...props }: SelectElementType) => {
  const [field, meta, helper] = useField(props)

  return (
    <div className={`select-container ${props.className}`}>
      <CreatableSelect
        {...field}
        {...props}
        {...selectElementsProps}
        onChange={(value: any) => {
          helper.setValue(value)
          props.onChange(value)
        }}
        className="element-props__select"
        classNames={{
          control: () => {
            return meta.error && 'element-props__select--error'
          },
          ...selectElementsProps.classNames,
        }}
      />

      {meta.touched && meta.error && (
        <span className="element-props__error--msg">{meta.error}</span>
      )}
    </div>
  )
}
