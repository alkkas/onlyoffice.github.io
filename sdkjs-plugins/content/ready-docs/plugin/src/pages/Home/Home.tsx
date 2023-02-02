import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    Asc.plugin.init = function () {
      this.callCommand(function () {
        let oDocument = Api.GetDocument()
        let oParagraph = Api.CreateParagraph()
        oParagraph.AddText('Hello world!')
        oDocument.InsertContent([oParagraph])
      }, true)
    }
  }, [])
  return <div>Home</div>
}
