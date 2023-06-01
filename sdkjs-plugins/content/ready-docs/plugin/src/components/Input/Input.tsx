import { FieldAttributes, useField } from 'formik'
import './Input.scss'

interface inputTypes {
  label: string
}

const Input = ({ label, ...props }: inputTypes & FieldAttributes<any>) => {
  const [field, meta] = useField(props)
  return (
    <div className="input-container">
      <label className="input__label" htmlFor={props.id || props.name}>
        {label}
      </label>
      <input
        className="form-control input input--login"
        {...field}
        {...props}
      />
      {meta.touched && meta.error && (
        <span className="input__error">{meta.error}</span>
      )}
    </div>
  )
}

export default Input
