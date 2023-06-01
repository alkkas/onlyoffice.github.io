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
      className={`checkbox ${checked ? 'checkbox--active' : ''}`}
      style={style}
      onClick={onChange}
    >
      <input
        type="checkbox"
        name="inputShow"
        id="inputShow"
        className="checkbox__input"
        checked={checked}
        onChange={onChange}
      />
      <button className="checkbox__btn">всегда</button>
      <button className="checkbox__btn">иногда</button>
    </label>
  )
}

export default Checkbox
