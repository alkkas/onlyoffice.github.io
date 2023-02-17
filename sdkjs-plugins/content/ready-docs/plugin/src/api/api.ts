import axios from 'axios'
import { categoriesParamsType } from 'pages/Home/Home'
import { apiHelper } from 'utils/utils'

interface logInType {
  login: string
  password: string
}

export const client = axios.create({
  baseURL: 'https://gotdoc.nord.su/api/',
  timeout: 7000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
})

//TODO remove jwt token cause it is transferred not in header
client.interceptors.request.use((config) => {
  if (config.url !== '?class=User&action=auth') {
    config.transformRequest = [
      (data) => {
        data.JWT = localStorage.getItem('access_token')
        return JSON.stringify(data)
      },
    ]
  }
  return config
})

// unauthorized request => clear token => user will be asked to login again
// if error happens it will be handled by react-query hence do not need try/catch
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === '403') {
      localStorage.removeItem('access_token')
      location.reload()
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
  const result = await client.post(
    '?class=Category&action=getCategories',
    values
  )
  return result.data.categories
}

export const getTemplate = async (categoryId: string) => {
  return apiHelper('post', 'Template', 'getTemplates', { categoryId })
}

export const getElements = async (TemplateId: string) => {
  return apiHelper('post', 'Template', 'getVariables', { TemplateId })
}
