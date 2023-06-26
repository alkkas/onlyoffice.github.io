import Select from 'components/Select'
import useChangeElementStruct from 'hooks/useChangeElementStruct'
import { useContext, useMemo } from 'react'
import { DocumentCondition, ElementStructCondition } from 'types/types'
import { ElementsContext, ElementStructContext } from '../../OfficeElement'
import { conditionsNames, conditionsType } from './ExtractedConditions'
type InputProps = {
  type: conditionsType
  condition: DocumentCondition | ElementStructCondition
}

const SelectOrInput = ({ type, condition }: InputProps) => {
  const conditionName = conditionsNames[type]
  const elements = useContext(ElementsContext)
  const elementStruct = useContext(ElementStructContext)
  const changeElementStruct = useChangeElementStruct()
  const chosenElement = elements.find(
    (item) => item.Title === condition.elementName
  )

  const valuesForCondition = useMemo(() => {
    let values = []
    if (type === 'condition') {
      values = chosenElement?.Struct.struct
    } else {
      values = elementStruct.data.struct
    }
    return values?.map((item) => ({
      value: item,
    }))
  }, [chosenElement?.Struct.struct, elementStruct.data.struct])

  const showSelect = useMemo(() => {
    if (type === 'condition') {
      return chosenElement?.Type === '6' || chosenElement?.Type === '7'
    } else {
      return elementStruct.data.typeId === 6 || elementStruct.data.typeId === 7
    }
  }, [chosenElement?.Type, elementStruct.data.typeId])

  const changeValue = (value: string, id: string) => {
    const condition = elementStruct.data[conditionName].find(
      (item) => item.id === id
    )
    if (condition.operatorType === 0) {
      changeElementStruct(conditionName, value, id, 'value')
    } else if (!isNaN(+value)) {
      changeElementStruct(conditionName, value, id, 'value')
    }
  }

  return (
    <>
      {showSelect ? (
        <Select
          options={valuesForCondition}
          value={valuesForCondition.find(
            (option) => option.value === condition.value
          )}
          getOptionLabel={(option) => option.value}
          onChange={(option) =>
            changeElementStruct(
              conditionName,
              option.value,
              condition.id,
              'value'
            )
          }
        />
      ) : (
        <input
          className="form-control input"
          placeholder="значение"
          value={condition.value}
          onChange={(e) => changeValue(e.target.value, condition.id)}
        />
      )}
    </>
  )
}
export default SelectOrInput
