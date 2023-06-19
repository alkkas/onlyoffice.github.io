import Select from 'components/Select'
import useChangeElementStruct from 'hooks/useChangeElementStruct'
import { useContext, useMemo } from 'react'
import { DocumentCondition, ElementStructCondition } from 'types/types'
import { ElementsContext, ElementStructContext } from '../../OfficeElement'
import { conditionsNames, conditionsType } from './ExtractedConditions'

type operatorsProps = {
  type: conditionsType
  condition: DocumentCondition | ElementStructCondition
}

const operators = [
  { id: 0, label: '=' },
  { id: 1, label: '>' },
  { id: 2, label: '<' },
]

const Operators = ({ type, condition }: operatorsProps) => {
  const changeElementStruct = useChangeElementStruct()
  const elementStruct = useContext(ElementStructContext)
  const elements = useContext(ElementsContext)
  const conditionName = conditionsNames[type]

  const isOperatorsSelectDisabled = useMemo(() => {
    if (type === 'condition') {
      return elements.some(
        (item) =>
          item.Title === condition.elementName &&
          (item.Type === '6' || item.Type === '7')
      )
    } else {
      return elementStruct.data.typeId === 6 || elementStruct.data.typeId === 7
    }
  }, [elements, elementStruct.data.typeId, condition.elementName])

  const changeOperatorValue = (
    item: any,
    id: string,
    fieldName: string,
    key: string
  ) => {
    changeElementStruct(conditionName, item, id, fieldName, key)
    const condition = elementStruct.data[conditionName].find(
      (item) => item.id === id
    )
    if (item.id !== 0) {
      const value = +condition.value || ''
      changeElementStruct(conditionName, value, id, 'value')
    }
  }

  return (
    <Select
      options={operators}
      getOptionValue={(option) => option.id}
      value={
        isOperatorsSelectDisabled
          ? operators[0]
          : operators.find((operator) => condition.operatorType === operator.id)
      }
      onChange={(option) =>
        changeOperatorValue(option, condition.id, 'operatorType', 'id')
      }
      isDisabled={isOperatorsSelectDisabled}
      isSearchable={false}
    />
  )
}

export default Operators
