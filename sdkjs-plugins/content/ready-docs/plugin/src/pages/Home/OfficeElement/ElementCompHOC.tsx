import React, { useContext, useMemo } from 'react'
import Condition from './elementsMisc/Condition'
import Document from './elementsMisc/Document'
import { typeOptionsType } from './ElementPropsStatic'
import { ElementContext } from 'pages/Home/OfficeElement/ElementProps'

export default function ElementCompHOC(
  Element: React.ComponentType,
  type: typeOptionsType['type']
) {
  return () => {
    const elementStruct = useContext(ElementContext)

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

        <Condition />
        <Document />
      </>
    )
  }
}
