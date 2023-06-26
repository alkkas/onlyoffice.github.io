import { array, object, setLocale, string } from 'yup'

setLocale({
  mixed: { required: 'заполните это поле' },
})

const officeSchema = object({
  chooseElement: string().required(),
  conditions: array().of(
    object().shape({
      elementName: string().required().nullable(),
      value: string().required(),
    })
  ),
})

export default officeSchema
