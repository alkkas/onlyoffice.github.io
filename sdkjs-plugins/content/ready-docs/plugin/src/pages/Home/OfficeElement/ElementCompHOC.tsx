import {
  ControlContext,
  ElementStructContext,
} from 'pages/Home/OfficeElement/OfficeElement'
import { useContext, useMemo } from 'react'
import { typeOptionsType } from './ElementPropsStatic'
import Condition from './elementsMisc/Condition'
import Document from './elementsMisc/Document'

export default function ElementCompHOC(
  Element: React.ComponentType,
  type: typeOptionsType['type']
) {
  return () => {
    const elementStruct = useContext(ElementStructContext)
    const currentControl = useContext(ControlContext)
    const parentType = useMemo(() => {
      const parentId = JSON.parse(currentControl?.Tag || '{}')?.parentId
      let parentType = ''
      Asc.plugin.executeMethod(
        'GetAllContentControls',
        null,
        function (data: any) {
          data.forEach((item: any) => {
            if (item.InternalId === parentId) {
              const itemTag = JSON.parse(item?.Tag || '{}')
              console.log(itemTag)
            }
          })
        }
      )
      return parentType
    }, [currentControl])
    const changeValue = () => {
      elementStruct.setData((prev) => ({
        ...prev,
        isHidden: !prev.isHidden,
      }))
    }

    return (
      <>
        {(type === 4 || type === 6) && (
          <div
            className="element-props__insert-checkbox"
            onChange={changeValue}
          >
            <input
              className="form-control"
              type="checkbox"
              id="insert_answer"
              checked={elementStruct.data.isHidden}
            />
            <label htmlFor="insert_answer">Вставлять ответ в документ</label>
          </div>
        )}
        <Element />
        {parentType !== '8' && (
          <>
            <Condition />
            {type !== 5 && type !== 8 && <Document />}
          </>
        )}
      </>
    )
  }
}
