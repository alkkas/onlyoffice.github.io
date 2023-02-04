import { Field, FieldAttributes, useField } from 'formik'
import styles from './Input.module.scss'

interface inputTypes {
  label: string
}

const Input = ({ label, ...props }: inputTypes & FieldAttributes<any>) => {
  const [field, meta] = useField(props)
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label} htmlFor={props.id || props.name}>
        {label}
      </label>
      <input
        className={`form-control ${styles.formInput}`}
        {...field}
        {...props}
      />
      {meta.touched && meta.error && (
        <span className={styles.error}>{meta.error}</span>
      )}
    </div>
  )
}

export default Input
