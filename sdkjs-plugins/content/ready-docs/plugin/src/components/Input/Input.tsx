import { FieldAttributes, useField } from 'formik'
import './Input.scss'

interface inputTypes {
  label: string
  containerClass: string
}

const Input = ({
  label,
  containerClass,
  ...props
}: inputTypes & FieldAttributes<any>) => {
  const [field, meta] = useField(props)
  const isShowError = meta?.touched && meta?.error

  return (
    <div className={`input-container ${containerClass || ''}`}>
      {label && (
        <label className="input__label" htmlFor={props.id || props.name}>
          {label}
        </label>
      )}
      <input
        {...field}
        {...props}
        className={`form-control input ${isShowError ? 'input--error' : ''}`}
      />
      {isShowError && <span className="input__error">{meta?.error}</span>}
    </div>
  )
}

export default Input
