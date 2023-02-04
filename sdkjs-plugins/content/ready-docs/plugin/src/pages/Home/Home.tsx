import { useEffect } from 'react'

export default function Home() {
  const printText = () => {
    Asc.plugin.executeMethod('InputText', ['ONLYOFFICE Plugins'])
  }

  return (
    <div>
      <button onClick={printText} className="btn-text-default">
        click
      </button>
    </div>
  )
}
