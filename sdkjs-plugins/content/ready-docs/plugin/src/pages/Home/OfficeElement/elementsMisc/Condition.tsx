import Checkbox from 'components/Checkbox/Checkbox'
import { ElementStructContext } from 'pages/Home/OfficeElement/ElementProps'
import { useContext, useMemo, useState } from 'react'
import ExtractedConditions from './ExtractedConditions'

import './Condition.styles.scss'

const Condition = () => {
  const elementStruct = useContext(ElementStructContext)
  const isConditionsExist = useMemo(
    () => !!elementStruct.data.displayConditions.length,
    [elementStruct.data]
  )
  const [isShow, setIsShow] = useState(isConditionsExist)

  return (
    <div style={{ margin: '15px 0' }}>
      <label className="condition__text" style={{ marginBottom: 10 }}>
        Отображать:
        <Checkbox
          style={{ marginLeft: '10px' }}
          onChange={() => setIsShow((prev) => !prev)}
          checked={isShow || isConditionsExist}
        />
      </label>
      {(isShow || isConditionsExist) && (
        <ExtractedConditions type="condition" />
      )}
    </div>
  )
}

export default Condition
