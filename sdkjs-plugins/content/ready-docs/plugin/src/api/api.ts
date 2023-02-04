import axios from 'axios'

interface logInType {
  email: string
  password: string
}

const client = axios.create({
  baseURL: 'https://gotdoc.nord.su/api/',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
})

export const userLogIn = async (values: logInType) => {
  try {
    const result = await client.post('?class=User&action=auth', values)
    const token = ''
    client.defaults.headers.post['Authorization'] = `Bearer ${token}`
    localStorage.setItem('access_token', token)
  } catch (e) {
    throw new Error(e.message)
  }
}
