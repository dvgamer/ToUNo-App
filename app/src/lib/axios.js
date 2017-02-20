import axios from 'axios'

export default axios.create({
  baseURL: 'https://touno.co/api/',
  timeout: 10000,
  method: 'POST',
  headers: {'Token-Auth': 'XXX'}
})
