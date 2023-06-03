import Select from 'components/Select'
import useChangeElementStruct from 'hooks/useChangeElementStruct'
import { TemplateContext } from 'pages/Home/Home'
import { useContext } from 'react'
import { DocumentCondition } from 'types/types'

type DocumentListProps = {
  condition: DocumentCondition
}

const DocumentList = ({ condition }: DocumentListProps) => {
  const changeElementStruct = useChangeElementStruct()
  const documents = useContext(TemplateContext)

  return (
    <>
      <h4 className="condition__title">То отобразить документ:</h4>
      <Select
        options={documents}
        getOptionLabel={(option) => option.Filename}
        getOptionValue={(option) => option.Id}
        value={documents.find(
          (document) => document.Filename === condition.docName
        )}
        onChange={(option) =>
          changeElementStruct(
            'docs',
            option,
            condition.id,
            'docName',
            'Filename'
          )
        }
        placeholder={'Выберете документ...'}
      />
    </>
  )
}

export default DocumentList
