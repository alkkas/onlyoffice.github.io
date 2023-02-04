import { object, string, setLocale } from 'yup'

setLocale({
  mixed: { required: 'это обязательное поле' },
  string: {
    email: 'неверный формат email',
  },
})
const schema = object({
  email: string().email().required(),
  password: string().required(),
})

export default schema
