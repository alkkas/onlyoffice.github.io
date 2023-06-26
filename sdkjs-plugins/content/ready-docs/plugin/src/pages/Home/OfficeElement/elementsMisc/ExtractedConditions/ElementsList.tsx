import SelectElement from 'components/SelectElement'
import useChangeElementStruct from 'hooks/useChangeElementStruct'
import { useContext } from 'react'
import { Element, ElementStructCondition } from 'types/types'
import { ElementsContext } from '../../OfficeElement'

type ElementListProps = { condition: ElementStructCondition }

const ElementsList = ({ condition }: ElementListProps) => {
  const elements = useContext(ElementsContext)
  const changeElementStruct = useChangeElementStruct()

  const changeElement = (
    option: Element,
    condition: ElementStructCondition
  ) => {
    changeElementStruct(
      'displayConditions',
      option,
      condition.id,
      'elementName',
      'Title'
    )
    changeElementStruct('displayConditions', '', condition.id, 'value')
  }

  return (
    <SelectElement
      options={elements.filter((element) => element.Type !== '9')}
      value={elements.find(
        (element) => condition.elementName === element.Title
      )}
      onChange={(option: Element) => changeElement(option, condition)}
      selectType="select"
    />
  )
}

export default ElementsList
