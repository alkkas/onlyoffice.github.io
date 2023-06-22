import { useMemo, useState } from 'react'
import { Element } from 'types/types'
import { v4 as uuid } from 'uuid'

export const useIsCCPartOfComplexList = (
  currentControl: any,
  elementsData: Element[]
) => {
  const [value, setValue] = useState(false)
  useMemo(() => {
    const tag = JSON.parse(currentControl?.Tag || '{}')
    let isParentComplexList = false
    if (Asc?.plugin?.executeMethod) {
      Asc.plugin.executeMethod(
        'GetAllContentControls',
        null,
        function (data: any) {
          data.forEach((item: any) => {
            if (item.InternalId === tag?.parentId) {
              const itemTag = JSON.parse(item.Tag)

              //TODO in original code parentName sets only then selecting the CC, that's vulnerable
              Asc.plugin.executeMethod('InsertAndReplaceContentControls', [
                [
                  {
                    Props: {
                      Id: uuid(),
                      Lock: 3,
                      Tag: JSON.stringify({
                        ...tag,
                        parentName: itemTag.elementTitle,
                      }),
                      InternalId: currentControl.InternalId,
                      Alias: tag.elementTitle || '',
                    },
                  },
                ],
              ])
              const isItemComplexList =
                elementsData.find(
                  (element) => element?.Title === itemTag.elementTitle
                )?.Type === '8'

              if (isItemComplexList) {
                isParentComplexList = true
              }
            }
          })
          setValue(isParentComplexList)
        }
      )
    }
  }, [currentControl])
  return value
}
