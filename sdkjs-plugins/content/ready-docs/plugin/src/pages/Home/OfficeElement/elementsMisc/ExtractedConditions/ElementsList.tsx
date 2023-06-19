import Select from 'components/Select'
import useChangeElementStruct from 'hooks/useChangeElementStruct'
import { selectElementsProps } from 'pages/Home/OfficeElement/ElementPropsStatic'
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
    <Select
      {...selectElementsProps}
      options={elements}
      value={elements.find(
        (element) => condition.elementName === element.Title
      )}
      onChange={(option) => changeElement(option, condition)}
    />
  )
}

export default ElementsList
