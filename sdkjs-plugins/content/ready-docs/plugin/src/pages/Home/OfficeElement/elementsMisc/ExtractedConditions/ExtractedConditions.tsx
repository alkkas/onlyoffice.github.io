import Button from 'components/Button'
import DeleteButton from 'components/DeleteButton/DeleteButton'
import Select from 'components/Select'
import useChangeElementStruct from 'hooks/useChangeElementStruct'
import {
  ElementsContext,
  ElementStructContext,
} from 'pages/Home/OfficeElement/ElementProps'
import { useContext, useLayoutEffect } from 'react'
import { DocumentCondition, ElementStructCondition } from 'types/types'
import { v4 as uuid } from 'uuid'
import DocumentList from './DocumentsList'
import ElementsList from './ElementsList'

const operators = [
  { id: 0, label: '=' },
  { id: 1, label: '>' },
  { id: 2, label: '<' },
]

const labels = {
  document: 'документ',
  condition: 'условие',
}

const conditionsNames = {
  document: 'docs',
  condition: 'displayConditions',
} as const

function ExtractedConditions({ type }: { type: 'document' | 'condition' }) {
  type ConditionsType = DocumentCondition[] | ElementStructCondition[]
  const conditionName = conditionsNames[type]
  const elements = useContext(ElementsContext)
  const elementStruct = useContext(ElementStructContext)
  console.log(elementStruct)
  const changeElementStruct = useChangeElementStruct()

  const setConditions = (func: (prev: ConditionsType) => ConditionsType) => {
    const newConditions = func(elementStruct.data[conditionName])
    elementStruct.setData((prev) => ({
      ...prev,
      [conditionName]: newConditions,
    }))
  }

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      {
        elementName: null,
        operatorType: 0,
        value: '',
        id: uuid(),
      },
    ])
  }

  const deleteCondition = (id: string) => {
    setConditions((prev) => {
      const newConditions: ConditionsType = []
      prev.forEach((condition) => {
        if (condition.id !== id) {
          newConditions.push(condition)
        }
      })
      return newConditions
    })
  }

  useLayoutEffect(() => {
    //api has no ids for conditions, so it's hard to understand which items changed
    //Hence I need to add my own ids
    elementStruct.setData((prev) => ({
      ...prev,
      [conditionName]: prev[conditionName].map((condition) => ({
        ...condition,
        id: uuid(),
      })),
    }))
  }, [])

  const changeValue = (value: string, id: string) => {
    const condition = elementStruct.data[conditionName].find(
      (item) => item.id === id
    )
    console.log(condition.operatorType)
    if (condition.operatorType === 0) {
      changeElementStruct(conditionName, value, id, 'value')
    } else if (!isNaN(+value)) {
      changeElementStruct(conditionName, value, id, 'value')
    }
  }

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
      console.log(value)
      changeElementStruct(conditionName, value, id, 'value')
    }
  }

  return (
    <div style={{ marginTop: 10 }}>
      {elementStruct.data[conditionName].map((condition) => {
        const chosenElement = elements.find(
          (item) => item.Title === condition.elementName
        )
        const valuesForCondition = chosenElement?.Struct.struct.map((item) => ({
          value: item,
          label: item,
        }))
        return (
          <div
            className={`condition__block ${
              type === 'document' ? 'condition__block--blue-border' : ''
            }`}
            key={condition.id}
          >
            {type === 'condition' ? (
              <ElementsList condition={condition} />
            ) : (
              <h4 className="condition__title">Если значение элемента</h4>
            )}
            <Select
              options={operators}
              getOptionValue={(option) => option.id}
              value={operators.find(
                (operator) => condition.operatorType === operator.id
              )}
              onChange={(option) =>
                changeOperatorValue(option, condition.id, 'operatorType', 'id')
              }
              isDisabled={elements.some(
                (item) =>
                  item.Title === condition.elementName &&
                  (item.Type === '6' || item.Type === '7')
              )}
              isSearchable={false}
            />

            {chosenElement?.Type === '6' || chosenElement?.Type === '7' ? (
              <Select
                options={valuesForCondition}
                value={valuesForCondition.find(
                  (option) => option.value === condition.value
                )}
                getOptionValue={(option) => option.value}
                onChange={(option) =>
                  changeElementStruct(
                    'displayConditions',
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

            {type === 'document' && (
              <DocumentList condition={condition as DocumentCondition} />
            )}
            <DeleteButton
              className="condition__delete-button"
              onClick={() => deleteCondition(condition.id)}
            />
          </div>
        )
      })}
      <Button
        onClick={addCondition}
        className="add-button"
      >{`Добавить ${labels[type]}`}</Button>
    </div>
  )
}

export default ExtractedConditions
