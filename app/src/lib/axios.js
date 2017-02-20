import axios from 'axios'

export default axios.create({
  baseURL: 'https://touno.co/api/',
  timeout: 10000,
  headers: {'Token-Auth': 'XXX'}
})
