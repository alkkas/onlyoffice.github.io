import axios from 'axios'
import { categoriesParamsType } from 'pages/Home/Home'

interface logInType {
  login: string
  password: string
}

const client = axios.create({
  baseURL: 'https://gotdoc.nord.su/api/',
  timeout: 7000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
})

//unauthorized request => clear token => user will be asked to login again
//if error happens it will be handled by react-query hence do not need try/catch

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === '403') {
      localStorage.removeItem('access_token')
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export const userLogIn = async (values: logInType) => {
  const result = await client.post('?class=User&action=auth', values)
  const token = result.data.Access_token
  client.defaults.headers.common['Authorization'] = `Bearer ${token}`
  localStorage.setItem('access_token', token)
  return result
}

export const getCategories = async (values: categoriesParamsType) => {
  //TODO remove jwt token cause it is transferred in header
  const result = await client.post('?class=Category&action=getCategories', {
    ...values,
    JWT: localStorage.getItem('access_token'),
  })
  return result.data.categories
}
