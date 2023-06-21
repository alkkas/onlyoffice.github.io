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

type pipeComponentsType = {
  Component: React.Context<any>
  value: any
}

export const pipeComponents =
  (...components: pipeComponentsType[]) =>
  (ChildComponent: JSX.Element) =>
    components.reduce(
      (Child, Item) => (
        <Item.Component.Provider value={Item.value}>
          {Child}
        </Item.Component.Provider>
      ),
      ChildComponent
    )

// export const getElementParent = () => {
//   Asc.plugin.callCommand(function () {
//     const obj = Asc.scope.obj
//     const control = obj.control
//     const oDocument = Api.GetDocument()
//     const controls = oDocument.GetAllContentControls()
//     for (const documentControl of controls) {
//       const documentControlObj = JSON.parse(documentControl.ToJSON())
//       if (documentControlObj.sdtPr.id === control.Id) {
//         const parent = documentControl.GetParentContentControl()
//         if (parent) {
//           Asc.scope.obj.parentId = parent.vf.eb
//           return
//         }
//       }
//     }
//   }, false)
// }

export const apiHelper = async (
  method: 'get' | 'post' | 'put' | 'delete',
  className: string,
  action: string,
  params: { [key: string]: string }
): Promise<any> => {
  const result = await client[method](
    `?class=${className}&action=${action}`,
    params
  )
  return result.data
}
