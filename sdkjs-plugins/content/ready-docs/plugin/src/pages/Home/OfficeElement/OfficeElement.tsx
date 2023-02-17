import './OfficeElement.styles.scss'
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from 'react'
const OfficeElement = () => {
  useEffect(() => {
    window.Asc.plugin.event_onFocusContentControl = (control: any) => {
      console.log(control)
      console.log('focused')
    }
    window.Asc.plugin.event_onClick = (event: any) => {
      console.log(event, 'asdfasdf')
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
      <h2 className="office-element__title">Элемент:</h2>
      <button
        className="btn-text-default office-element__btn"
        onClick={addElement}
      >
        Создать элемент
      </button>
    </>
  )
}

export default OfficeElement
