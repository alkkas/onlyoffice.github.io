import { useContext, useState } from 'react'
import { ElementContext } from 'pages/Home/OfficeElement/ElementProps'
import Checkbox from 'components/Checkbox/Checkbox'
import './Condition.styles.scss'

const Condition = () => {
  const elementProps = useContext(ElementContext)
  console.log(elementProps)
  const [isShow, setIsShow] = useState<boolean>(
    !!elementProps?.data?.displayConditions?.length
  )

  return (
    <>
      <label className="condition__text">
        Отображать:
        <Checkbox
          style={{ marginLeft: '10px' }}
          onChange={() => setIsShow((prev) => !prev)}
          checked={isShow}
        />
      </label>
    </>
  )
}

export default Condition
