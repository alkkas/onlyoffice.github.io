import { ElementStructContext } from 'pages/Home/OfficeElement/OfficeElement'
import { useContext } from 'react'

const useChangeElementStruct = () => {
  const elementStruct = useContext(ElementStructContext)

  return (
    conditionName: 'displayConditions' | 'docs',
    item: any,
    id: string,
    fieldName: string,
    key?: string
  ) =>
    elementStruct.setData((prev) => {
      let newValue: any
      if (key !== undefined) {
        newValue = item[key]
      } else {
        newValue = item
      }
      const conditions = prev[conditionName].map((condition) =>
        condition.id === id
          ? { ...condition, [fieldName]: newValue }
          : condition
      )
      return { ...prev, [conditionName]: conditions }
    })
}

export default useChangeElementStruct
