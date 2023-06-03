import Select from 'components/Select'
import { ElementStructContext } from 'pages/Home/OfficeElement/ElementProps'
import { useContext, useMemo } from 'react'

//TODO change cases from 0..5 to 1..6

type word = {
  id: 0 | 1 | 2 | 3 | 4 | 5
  label: string
}

const wordCases = [
  { id: 0, label: 'Именительный' },
  { id: 1, label: 'Родительный' },
  { id: 2, label: 'Дательный' },
  { id: 3, label: 'Винительный' },
  { id: 4, label: 'Творительный' },
  { id: 5, label: 'Предложный' },
]

const InputField = () => {
  const elementStruct = useContext(ElementStructContext)
  const currentValue = useMemo(
    () => wordCases.find((option) => option.id === elementStruct.data.case),
    [elementStruct.data.case]
  )
  const changeCase = (option: word) => {
    elementStruct.setData((prev) => ({ ...prev, case: option.id }))
  }
  return (
    <>
      <p style={{ marginBottom: 5 }}>Падеж:</p>

      <Select
        options={wordCases}
        value={currentValue}
        onChange={changeCase}
        getOptionValue={(option) => option.id}
      />
    </>
  )
}

export default InputField
