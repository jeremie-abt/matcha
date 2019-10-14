import React, { useEffect, useState } from 'react'
import FormConstructor from '../FormConstructor'
import axios from 'axios'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

const fields = [
  {
    name: 'maxAge',
    label: 'maxAge',
    type: 'text'
  },
  {
    name: 'maxScore',
    label: 'maxScore',
    type: 'text'
  },
  {
    name: 'maxDistance',
    label: 'maxDistance',
    type: 'text'
  },
  {
    name: 'tags',
    title: 'Tags',
    type: 'checkbox',
    checkboxValues: []
  }
]

function FormFilter() {
  const [inputs, setInputs] = useState(fields)

  useEffect(() => {
    axios
      .get('/tags/all', { cancelToken: source.token })
      .then(resp => {
        const newData = [...fields]
        let input = newData.find(elem => elem.name === 'tags')
        input.checkboxValues = resp.data
        setInputs(newData)
      })
      .catch(e => {
        console.log('le catch : ', e)
      })
    return () => {
      source.cancel('Operation canceled')
    }
  }, [])

  function handleSubmit(e) {
    alert('yeah Im called')
  }

  return <FormConstructor fields={inputs} handleForm={handleSubmit} />
}

export default FormFilter
