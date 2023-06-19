import Button from 'components/Button'
import DeleteButton from 'components/DeleteButton/DeleteButton'
import { useContext, useState } from 'react'
import { ElementStructContext } from '../../OfficeElement'
import './RadioAndCheckbox.styles.scss'

const RadioInput = () => {
  const [value, setValue] = useState('')
  const elementStruct = useContext(ElementStructContext)

  const addValue = () => {
    elementStruct.setData((prev) => ({
      ...prev,
      struct: [...prev.struct, value],
    }))
    setValue('')
  }

  const deleteValue = (indexToDelete: number) => {
    elementStruct.setData((prev) => ({
      ...prev,
      struct: [...prev.struct.filter((_, index) => index !== indexToDelete)],
    }))
  }

  return (
    <>
      <p style={{ margin: '15px 0 5px' }}>Значения:</p>
      <div className="radio-box">
        <input
          className="form-control input"
          placeholder="введите значение..."
          style={{ flexGrow: 1 }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button disabled={!value.trim()} onClick={addValue}>
          Создать
        </Button>
      </div>
      <div className="radio-items">
        {elementStruct.data.struct.map((value, index) => (
          <span className="radio__item">
            <p>{value}</p>
            <DeleteButton
              style={{ transform: 'scale(0.75)' }}
              onClick={() => deleteValue(index)}
            />
          </span>
        ))}
      </div>
    </>
  )
}

export default RadioInput
