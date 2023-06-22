import { object, setLocale, string } from 'yup'

setLocale({
  mixed: { required: 'заполните это поле' },
})

const officeSchema = object({
  chooseElement: string().required(),
})

export default officeSchema
