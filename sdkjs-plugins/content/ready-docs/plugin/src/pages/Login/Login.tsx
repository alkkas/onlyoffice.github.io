import { Form, Formik } from 'formik'
import Input from 'components/Input/Input'
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Login.scss'
import schema from './loginSchema'
import { useMutation } from 'react-query'
import { userLogIn } from 'src/api/api'
import { useEffect } from 'react'
const initialValues = {
  email: '',
  password: '',
}

export default function Login() {
  const logIn = useMutation(userLogIn, {
    onError: () => {
      toast.error('Упс, произошлая ошибка')
    },
    onSuccess: () => {
      //set state here later
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
            <Input label="введите email" name="email" type="email" />
            <Input label="введите пароль" name="password" type="password" />
            <button
              className="btn-text-default submit login__button"
              type="submit"
              disabled={
                Object.keys(errors).length !== 0 ||
                Object.keys(touched).length === 0
              }
            >
              Отправить
            </button>
          </Form>
        )}
      </Formik>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        limit={3}
        hideProgressBar={true}
        transition={Slide}
      />
    </section>
  )
}
