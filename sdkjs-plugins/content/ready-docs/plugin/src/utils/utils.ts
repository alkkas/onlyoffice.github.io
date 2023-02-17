import { client } from 'api/api'

export const debounce = (func: (...args: any) => void, time: number) => {
  let timer: NodeJS.Timeout
  return async (...args: any) => {
    clearTimeout(timer)
    const result: any = await new Promise((resolve) => {
      timer = setTimeout(() => resolve(func(args)), time)
    })
    return result
  }
}

export const getElementParent = () => {
  window.Asc.plugin.callCommand(function () {
    const control = Asc.scope.control
    const oDocument = Api.GetDocument()
    const controls = oDocument.GetAllContentControls()
    for (const documentControl of controls) {
      const documentControlObj = JSON.parse(documentControl.ToJSON())
      if (documentControlObj.sdtPr.id === control.Id) {
        const parent = documentControl.GetParentContentControl()
        if (parent) {
          Asc.scope.parent = JSON.parse(parent.ToJSON())
          console.log(Asc.scope.parent)
          break
        }
      }
    }
  }, false)
}

export const apiHelper = async (
  method: 'get' | 'post' | 'put' | 'delete',
  className: string,
  action: string,
  params: { [key: string]: string }
): Promise<any> => {
  const result = await client[method](`?class=${className}&action=${action}`, {
    ...params,
  })
  return result.data
}
