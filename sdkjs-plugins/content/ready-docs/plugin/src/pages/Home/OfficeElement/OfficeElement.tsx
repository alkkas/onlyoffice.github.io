import './OfficeElement.styles.scss'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState } from 'react'
import ElementProps from 'pages/Home/OfficeElement/ElementProps'
import { getElementParent } from 'utils/utils'
import Button from 'components/Button'

const OfficeElement = () => {
  const [propsIsActive, setPropsIsActive] = useState(false)

  useEffect(() => {
    window.Asc.plugin.event_onFocusContentControl = function (control: any) {
      // I can't pass parameters to function cause its evaluates in another environment
      // it can't access outer scope
      // this is only office restriction
      // parameters should be passed throw Asc.scope obj
      // for more info: https://api.onlyoffice.com/plugin/scope
      // this method is vulnerable to bugs, hope it will be fixed :(
      Asc.scope.control = control
      Asc.scope.parent = undefined
      getElementParent()
      setPropsIsActive(true)
    }

    window.Asc.plugin.event_onBlurContentControl = (control: any) => {
      setPropsIsActive(false)
    }
  }, [])

  const addElement = () => {
    window.Asc.plugin.executeMethod('AddContentControl', [
      1,
      { Id: uuidv4(), Tag: '{tag}', Lock: 3, PlaceHolderText: 'название...' },
    ])
  }
  return (
    <>
      {propsIsActive && <ElementProps />}
      <ElementProps />
      <Button className="office-element__btn submit" onClick={addElement}>
        Создать элемент
      </Button>
    </>
  )
}

export default OfficeElement
