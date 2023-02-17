import React from 'react'
import Condition from 'pages/Home/OfficeElement/elementsMisc/Condition'
import { typeOptionsType } from 'pages/Home/OfficeElement/ElementProps'

export default function ElementCompHOC(
  Element: React.ComponentType,
  type: typeOptionsType['type']
) {
  return () => {
    return (
      <>
        <Element />

        {(type === 4 || type === 'radio') && (
          <div className="element-props__insert-checkbox">
            <input
              className="form-control"
              type="checkbox"
              id="insert_answer"
            />
            <label htmlFor="insert_answer">Вставлять ответ в документ</label>
          </div>
        )}
        {(type === 4 || type === 'radio' || type === 'checkbox') && <div></div>}

        <Condition />
      </>
    )
  }
}
