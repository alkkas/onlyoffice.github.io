import Select from 'components/Select'
import { selectFlagsProps } from 'pages/Home/OfficeElement/ElementPropsStatic'
import DeleteButton from 'components/DeleteButton/DeleteButton'
import Button from 'components/Button'
import { DocumentConditions, ElementStructCondition } from 'types/types'
import { useContext, useLayoutEffect, useRef, useState, useEffect } from 'react'
import { FlagsContext } from 'pages/Home/OfficeElement/ElementProps'
import { TemplateContext } from 'pages/Home/Home'
import { v4 as uuid } from 'uuid'
import gsap from 'gsap'
import Flip from 'gsap/Flip'
const operators = [
  { id: 1, label: '=' },
  { id: 2, label: '>' },
  { id: 3, label: '<' },
]

const labels = {
  document: 'документ',
  condition: 'условие',
}

type extractedConditionsProps = {
  type: 'document' | 'condition'
}

type extraProps = {
  id: string
  status: 'entered' | 'exiting'
}

type ConditionArrayUnion<T> = T extends T ? (T & extraProps)[] : never
type Conditions = ConditionArrayUnion<
  DocumentConditions | ElementStructCondition
>
gsap.registerPlugin(Flip)

const ExtractedConditions = ({ type }: extractedConditionsProps) => {
  const flags = useContext(FlagsContext)
  const documents = useContext(TemplateContext)
  const wrapper = useRef()
  const q = gsap.utils.selector(wrapper)
  const [ctx] = useState(() => gsap.context(() => {}))
  const [elementsState, setElementsState] = useState<Flip.FlipState>()
  const [conditions, setConditions] = useState<Conditions>([])

  const addCondition = () => {
    setElementsState(Flip.getState(q('.condition__block, .add-button')))
    setConditions((prev) => [
      ...prev,
      {
        elementName: null,
        operatorType: 0,
        value: '',
        id: uuid(),
        status: 'entered',
      },
    ])
  }

  const deleteCondition = (id: string) => {
    setConditions((prev) => {
      const newConditions: Conditions = []
      prev.forEach((condition) => {
        if (condition.id === id) {
          condition.status = 'exiting'
        }
        newConditions.push(condition)
      })
      return newConditions
    })
    setElementsState(Flip.getState(q('.condition__block, .add-button')))
  }

  const removeItems = (items: Conditions) => {
    if (!items?.length) return
    setElementsState(Flip.getState(q('.condition__block, .add-button')))
    setConditions((prev) => {
      return prev.filter((condition) => condition.status !== 'exiting')
    })
  }

  useLayoutEffect(() => {
    if (!elementsState) return
    const exiting = conditions.filter((item) => item.status === 'exiting')
    ctx.add(() => {
      const timeline = Flip.from(elementsState, {
        // absolute: true,
        ease: 'power1.inOut',
        targets: q('.condition__block, .add-button'),
        scale: true,
        simple: true,
        onEnter: (elements: any) => {
          return gsap.fromTo(
            elements,
            {
              opacity: 0,
            },
            {
              opacity: 1,
              delay: 0.2,
              duration: 0.2,
            }
          )
        },
        onLeave: (elements: any) => {
          return gsap.fromTo(
            elements,
            { opacity: 1, scale: 1 },
            {
              opacity: 0,
              scale: 0,
            }
          )
        },
      })

      timeline.add(() => removeItems(exiting))
    })
  }, [ctx, elementsState, q])
  useEffect(() => {
    return () => ctx.revert()
  }, [])

  return (
    <div style={{ marginTop: 10 }} ref={wrapper}>
      {conditions.map((condition) => (
        <div
          className={`condition__block ${
            type === 'document' ? 'condition__block--blue-border' : ''
          } ${
            condition.status === 'exiting' ? 'condition__block--exiting' : ''
          }`}
          key={condition.id}
        >
          {type === 'condition' ? (
            <Select {...selectFlagsProps} options={flags} />
          ) : (
            <h4 className="condition__title">Если значение елемента</h4>
          )}
          <Select
            options={operators}
            getOptionValue={(option) => option.id}
            defaultValue={operators.find((operator) => operator.id === 1)}
            isSearchable={false}
          />
          <input className="form-control input" placeholder="значение" />
          {type === 'document' && (
            <>
              <h4 className="condition__title">То отобразить документ:</h4>
              <Select
                options={documents}
                getOptionLabel={(option) => option.Filename}
                getOptionValue={(option) => option.Id}
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
