import { Form, Formik } from 'formik'
import Input from 'components/Input/Input'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Login.scss'
import schema from './loginSchema'
import { useMutation } from 'react-query'
import { userLogIn } from 'api/api'
import Load from 'components/Load/Load'
import { useEffect } from 'react'

const initialValues = {
  login: '',
  password: '',
}

export default function Login() {
  const logIn = useMutation(userLogIn, {
    onError: () => {
      toast.error('Упс, произошлая ошибка')
    },
    onSuccess: () => {
      window.location.reload()
    },
  })

  const submitForm = (values: typeof initialValues) => {
    logIn.mutate(values)
  }
  return (
    <section>
      <h1 className="title">Войдите в систему</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={submitForm}
        validationSchema={schema}
      >
        {({ errors, touched }) => (
          <Form>
            <Input label="введите email" name="login" type="text" />
            <Input label="введите пароль" name="password" type="password" />
            <button
              className="btn-text-default submit login__button"
              type="submit"
              disabled={
                Object.keys(errors).length !== 0 ||
                Object.keys(touched).length === 0 ||
                logIn.isLoading
              }
            >
              Отправить
            </button>
          </Form>
        )}
      </Formik>
      {logIn.isLoading && <Load />}
    </section>
  )
}
