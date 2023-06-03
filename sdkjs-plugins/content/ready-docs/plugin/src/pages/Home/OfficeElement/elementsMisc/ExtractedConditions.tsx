import Button from 'components/Button'
import DeleteButton from 'components/DeleteButton/DeleteButton'
import Select from 'components/Select'
import { TemplateContext } from 'pages/Home/Home'
import {
  ElementsContext,
  ElementStructContext,
} from 'pages/Home/OfficeElement/ElementProps'
import { selectFlagsProps } from 'pages/Home/OfficeElement/ElementPropsStatic'
import { useContext, useLayoutEffect } from 'react'
import { DocumentConditions, ElementStructCondition } from 'types/types'
import { v4 as uuid } from 'uuid'
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

type typeValues = 'document' | 'condition'

type Conditions<T> = T extends 'document'
  ? DocumentConditions[]
  : T extends 'condition'
  ? ElementStructCondition[]
  : never

const ExtractedConditions = ({ type }: { type: typeValues }) => {
  type ConditionsType = Conditions<typeValues>
  const conditionName = conditionsNames[type]

  const elements = useContext(ElementsContext)
  const documents = useContext(TemplateContext)
  const elementStruct = useContext(ElementStructContext)

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

  function changeElementStructValue(
    option: any,
    id: string,
    operator: string,
    key: string
  ) {
    elementStruct.setData((prev) => {
      const conditions = prev[conditionName].map((condition) =>
        condition.id === id
          ? { ...condition, [operator]: option[key] }
          : condition
      )
      return { ...prev, [conditionName]: conditions }
    })
  }

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
            <Select
              {...selectFlagsProps}
              options={elements}
              value={elements.find(
                (element) => condition.elementName === element.Title
              )}
              onChange={(option) =>
                changeElementStructValue(
                  option,
                  condition.id,
                  'elementName',
                  'Title'
                )
              }
            />
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
              changeElementStructValue(
                option,
                condition.id,
                'operatorType',
                'id'
              )
            }
            isSearchable={false}
          />
          <input
            className="form-control input"
            placeholder="значение"
            value={condition.value}
          />
          {type === 'document' && (
            <>
              <h4 className="condition__title">То отобразить документ:</h4>
              <Select
                options={documents}
                getOptionLabel={(option) => option.Filename}
                getOptionValue={(option) => option.Id}
                value={documents.find(
                  (document) => document.Filename === condition.docName
                )}
                placeholder={'Выберете документ...'}
              />
            </>
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
