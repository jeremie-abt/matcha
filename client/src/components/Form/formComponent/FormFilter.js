import React, { useEffect, useState, useContext } from 'react'
import FormConstructor from '../FormConstructor'
import axios from 'axios'
import Cookies from 'universal-cookie'

import userContext from '../../../context/UserContext'
import ProfilSearchable from '../../../components/Profil/ProfilSearchable'

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
  },
  {
    name: 'sexual_orientation',
    title: 'sexual orientation',
    type: 'radio',
    radioValues: ['male', 'female']
  }
]

// function used for the sorting
function FormFilter() {
  const context = useContext(userContext)
  const [inputs, setInputs] = useState(fields)
  const [profils, setProfils] = useState([])
  const [filters, setFilters] = useState({})

  function _calculateScore(a, b) {
    let aScore = 0

    aScore = a.score - b.score
    context.store.user.tags.forEach(elem => {
      if (a.tags.includes(elem)) {
        aScore += 2
      }
    })
    return aScore
  }

  /**
   *
   * @param {array} profils
   */
  function _sortProfil(a, b) {
    // if return 0 b est classe avant

    let aFinalScore = _calculateScore(a, b)
    let bFinalScore = _calculateScore(b, a)

    if (aFinalScore > bFinalScore) {
      return -1
    } else if (aFinalScore < bFinalScore) {
      return 1
    } else return 0
  }

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
      source.cancel('Operation canceled') // a suppr avant de pr
    }
  }, [])

  // a vir si faut faire la memoization ca me semble bizarre tout de meme
  function fetchProfils(userInfos) {
    const cookies = new Cookies()
    const token = cookies.get('token')
    axios
      .get('/search', {
        params: userInfos,
        headers: {
          authorization: 'Bearer ' + token
        }
      })
      .then(resp => {
        setProfils(resp.data)
      })
      .catch(e => {
        // utiliser les messages
        console.log('aie ', e)
      })
  }

  useEffect(() => {
    fetchProfils(context.store.user)
  }, [context.store.user])

  function handleSubmit({ state }) {
    const newState = Object.assign({}, context.store.user, state)
    fetchProfils(newState)
  }

  function handleChange({ state }) {
    // Atention en vraie ca va beaucoup rerender
    setFilters(state)
  }

  return (
    <div>
      <FormConstructor
        fields={inputs}
        handleForm={handleSubmit}
        handleChange={handleChange}
      />
      {profils
        .filter((elem, index) => {
          let isFalse = false
          Object.keys(filters).forEach(filter => {
            // eslint-disable-next-line default-case
            if (filter.startsWith('max')) {
              const filterName = filter.split('max')[1].toLowerCase()
              if (
                filters[filter] !== '' &&
                elem[filterName] &&
                elem[filterName] > filters[filter]
              ) {
                isFalse = true
              }
            }
          })
          return !isFalse
        })
        .sort(_sortProfil)
        .map((elem, index) => {
          return <ProfilSearchable userInfos={elem} key={index} />
        })}
    </div>
  )
}

export default FormFilter
