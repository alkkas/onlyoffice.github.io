import { useContext, useState } from 'react'
import { ElementContext } from 'pages/Home/OfficeElement/ElementProps'
import Checkbox from 'components/Checkbox/Checkbox'
import ExtractedConditions from './ExtractedConditions'
import './Condition.styles.scss'

const Condition = () => {
  const elementStruct = useContext(ElementContext)
  const isConditionsExist = !!elementStruct?.data?.displayConditions?.length
  const [isShow, setIsShow] = useState(isConditionsExist)
  console.log(isShow)
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
