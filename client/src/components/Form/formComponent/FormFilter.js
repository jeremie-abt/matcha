/* eslint-disable eqeqeq */
import React, { useEffect, useState, useContext } from 'react'
import FormConstructor from '../FormConstructor'
import axios from 'axios'
import { useToasts } from 'react-toast-notifications'
import Cookies from 'universal-cookie'

import userContext from '../../../context/UserContext'
import ProfilSearchable from '../../../components/Profil/ProfilSearchable'
import ReportModal from '../../miscellaneous/ReportModal'

const fields = [
  {
    name: 'maxAge',
    label: 'age',
    type: 'range',
    range: [18, 98],
    defaultValues: [18, 45]
  },
  {
    name: 'maxScore',
    label: 'score',
    type: 'range',
    range: [0, 10],
    defaultValues: [1, 6]
  },
  {
    name: 'maxDistance',
    label: 'maxDistance',
    type: 'slider',
    defaultValue: 80
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
  const [showModal, setShowModal] = useState(false)
  const [reportedId, setReportedId] = useState(false)
  const [profils, setProfils] = useState([])
  const [filters, setFilters] = useState({})

  const { addToast } = useToasts()

  function _calculateScore(a, b) {
    let aScore

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

  // setting the state correctly
  useEffect(() => {
    const filtersObj = {}
    fields.forEach(elem => {
      if (elem.type === 'range') {
        filtersObj[elem.name] = elem.defaultValues
      } else if (elem.type === 'slider') {
        filtersObj[elem.name] = elem.defaultValue
      }
    })
    setFilters(filtersObj)
  }, [])

  useEffect(() => {
    axios
      .get('/tags/all')
      .then(resp => {
        const newData = [...fields]
        let input = newData.find(elem => elem.name === 'tags')
        input.checkboxValues = resp.data
        setInputs(newData)
      })
      .catch(e => {
        console.log('le catch : ', e)
      })
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

  function updateProfils(id) {
    const tmpArray = profils.filter(elem => elem.id != id)
    setProfils(tmpArray)
  }

  function handleBlocked(blockedId) {
    axios
      .post('/blocked/add', { userId: context.store.user.id, blockedId })
      .then(result => {
        if (result.status === 200) updateProfils(blockedId)
      })
      .catch(err => {
        addToast('Erreur pendant le report !', {
          appearance: 'Error',
          autoDismiss: true
        })
        throw err
      })
  }

  function handleReport(e) {
    const id = parseInt(e.target.getAttribute('id'), 10)
    setReportedId(id)
    setShowModal(true)
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

              if (elem[filterName]) {
                if (Array.isArray(filters[filter])) {
                  const boundaries = filters[filter]
                  if (
                    elem[filterName] < boundaries[0] ||
                    elem[filterName] > boundaries[1]
                  ) {
                    isFalse = true
                  }
                } else {
                  if (elem[filterName] > filters[filter]) {
                    isFalse = true
                  }
                }
              }
            }
          })
          return !isFalse
        })
        .sort(_sortProfil)
        .map((elem, index) => {
          return (
            <ProfilSearchable
              userInfos={elem}
              handleBlocked={handleBlocked}
              handleReport={handleReport}
              key={index}
            />
          )
        })}
      {showModal && (
        <ReportModal
          userId={context.store.user.id}
          reportedId={reportedId}
          blockedFunction={handleBlocked}
          show={showModal}
          setShowModal={setShowModal}
          updateProfils={updateProfils}
        />
      )}
    </div>
  )
}

export default FormFilter
