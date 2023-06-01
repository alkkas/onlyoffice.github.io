import Button from 'components/Button'
import ExtractedConditions from 'pages/Home/OfficeElement/elementsMisc/ExtractedConditions'

const Document = () => {
  return (
    <>
      <p style={{ marginBottom: 10 }}>Документы:</p>
      <ExtractedConditions type="document" />
    </>
  )
}

export default Document
