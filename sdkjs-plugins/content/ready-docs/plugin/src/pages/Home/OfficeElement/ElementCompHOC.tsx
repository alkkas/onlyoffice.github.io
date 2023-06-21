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
    const parentId = useMemo(
      () => JSON.parse(currentControl?.Tag || '{}')?.parentId,
      [currentControl]
    )
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
        {!parentId && (
          <>
            <Condition />
            {type !== 5 && type !== 8 && <Document />}
          </>
        )}
      </>
    )
  }
}
