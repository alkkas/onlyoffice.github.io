import Checkbox from 'components/Checkbox/Checkbox'
import { ElementStructContext } from 'pages/Home/OfficeElement/OfficeElement'
import { useContext } from 'react'
import { v4 as uuid } from 'uuid'
import ExtractedConditions from './ExtractedConditions/ExtractedConditions'

import './Condition.styles.scss'

const Condition = () => {
  const elementStruct = useContext(ElementStructContext)
  const isConditionsExist = !!elementStruct.data.displayConditions.length

  const changeConditionValue = () => {
    if (isConditionsExist) {
      elementStruct.setData((prev) => ({ ...prev, displayConditions: [] }))
    } else {
      elementStruct.setData((prev) => ({
        ...prev,
        displayConditions: [
          { elementName: null, operatorType: 0, value: '', id: uuid() },
        ],
      }))
    }
  }

  return (
    <div style={{ margin: '15px 0' }}>
      <label className="condition__text" style={{ marginBottom: 10 }}>
        Отображать:
        <Checkbox
          style={{ marginLeft: '10px' }}
          onChange={changeConditionValue}
          checked={isConditionsExist}
        />
      </label>
      {isConditionsExist && <ExtractedConditions type="condition" />}
    </div>
  )
}

export default Condition
