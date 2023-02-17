import './Checkbox.styles.scss'

interface CheckboxType {
  onChange: () => void
  checked: boolean
  style?: any
}

const Checkbox = ({ onChange, checked, style }: CheckboxType) => {
  return (
    <label
      htmlFor="inputShow"
      className={`checkbox ${checked ? 'checkbox--sometime' : ''}`}
      onClick={onChange}
      style={style}
    >
      <input
        type="checkbox"
        name="show"
        id="inputShow"
        className="checkbox__input"
        checked={checked}
      />
      <button className="checkbox__btn">всегда</button>
      <button className="checkbox__btn">иногда</button>
    </label>
  )
}

export default Checkbox
