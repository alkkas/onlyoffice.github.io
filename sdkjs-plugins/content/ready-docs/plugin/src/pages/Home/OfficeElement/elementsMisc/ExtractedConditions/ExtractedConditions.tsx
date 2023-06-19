import Button from 'components/Button'
import DeleteButton from 'components/DeleteButton/DeleteButton'
import { ElementStructContext } from 'pages/Home/OfficeElement/OfficeElement'
import { useContext, useLayoutEffect } from 'react'
import { DocumentCondition, ElementStructCondition } from 'types/types'
import { v4 as uuid } from 'uuid'
import DocumentList from './DocumentsList'
import ElementsList from './ElementsList'
import Operators from './Operators'
import SelectOrInput from './SelectOrInput'

const labels = {
  document: 'документ',
  condition: 'условие',
}

export const conditionsNames = {
  document: 'docs',
  condition: 'displayConditions',
} as const

export type conditionsType = 'document' | 'condition'

function ExtractedConditions({ type }: { type: conditionsType }) {
  type ConditionsType = DocumentCondition[] | ElementStructCondition[]
  const conditionName = conditionsNames[type]
  const elementStruct = useContext(ElementStructContext)
  console.log(elementStruct)

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
      [conditionName]: prev[conditionName].map((condition) => {
        if (condition?.id) {
          return condition
        } else {
          return {
            ...condition,
            id: uuid(),
          }
        }
      }),
    }))
  }, [])

  return (
    <div style={{ marginTop: 10 }}>
      {elementStruct.data[conditionName].map((condition) => (
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
          <Operators type={type} condition={condition} />
          <SelectOrInput type={type} condition={condition} />

          {type === 'document' && (
            <DocumentList condition={condition as DocumentCondition} />
          )}
          <DeleteButton
            className="condition__delete-button"
            onClick={() => deleteCondition(condition.id)}
          />
        </div>
      ))}
      <Button
        onClick={addCondition}
        className="add-button"
      >{`Добавить ${labels[type]}`}</Button>
    </div>
  )
}

export default ExtractedConditions
