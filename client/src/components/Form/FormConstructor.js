import React, { useContext, useState, useEffect } from 'react'

import { Button, Form, Content } from 'react-bulma-components'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import InputComponent from './InputStyle/InputStyle'
import Checkbox from './InputStyle/CheckboxStyle'
import MyRadio from './InputStyle/RadioStyle'

import UserContext from '../../context/UserContext'

function FormConstructor(props) {
  const context = useContext(UserContext)
  const [state, setState] = useState({})
  const [checkbox, setCheckbox] = useState({})
  
  useEffect(() => {
    console.log("useEffect called")
    console.log("state suer : ", context.store.user)
    const checkboxObj = {}
    const stateObj = {}
    props.fields.forEach(elem => {
      if (elem.type === 'checkbox') {
        if (context.store.user[elem.name] !== undefined)
          checkboxObj[elem.name] = context.store.user[elem.name]
      } else if (elem.type === 'radio') {
        stateObj[elem.name] = context.store.user[elem.name]
      }
    })
    setCheckbox(checkboxObj)
    setState(stateObj)
  }, [props.fields, context.store.user, context.store.isAuth])
  

  const _renderText = ({ elem, placeholder }) => {
    return (
      <InputComponent
        {...elem}
        onChange={handleChange}
        value={state[elem.name]}
        key={elem.name + elem.type}
        placeholder={context.store.isAtuh && placeholder}
      />
    )
  }

  const _renderRadio = elem => {
    return elem.radioValues.map(radioElem => {
      return (
        <MyRadio
          categorie={elem.name}
          label={radioElem}
          name={radioElem}
          handleChange={handleChange}
          checked={state[elem.name] === radioElem}
          key={radioElem + elem.type}
        />
      )
    })
  }

  const _renderCheckbox = elem => {
    let checkboxComponent

    return (
      <Form.Field key={elem.name + elem.type}>
        <Form.Control>
          <Form.Label>{elem.title}</Form.Label>
          {// le data-key est la car je n'arrive pas a 
          
          // access l'attribute key dans handlechange
          }
          {
          elem.checkboxValues.map(checkboxElem => {
            checkboxComponent = (
              <Checkbox
                categorie={elem.name}
                name={checkboxElem.name}
                label={checkboxElem.name}
                handleChange={handleChange}
                checked={checkbox[elem.name].includes(checkboxElem.id)}
                key={checkboxElem.id}
                data-key={checkboxElem.id}
              />
            )
            return checkboxComponent
          })}
        }
        <div>tags</div>
        </Form.Control>
      </Form.Field>
    )
  }

  /**
   *  Parent of form generation.
   */
  const handleChange = e => {
    if (e.target.type === 'checkbox') {
      const categorie = e.target.getAttribute('categorie')
      const key = parseInt(e.target.getAttribute('data-key'))

      let newCurCheckboxObj = checkbox[categorie]
      if (newCurCheckboxObj.includes(key)) {
        const index = newCurCheckboxObj.indexOf(key)
        newCurCheckboxObj.splice(index, 1)
      } else {
        newCurCheckboxObj.push(key)
      }
      const newCheckboxObj = { ...checkbox }
      newCheckboxObj[categorie] = newCurCheckboxObj
      setCheckbox(newCheckboxObj)
    } else if (e.target.type === 'radio') {
      const categorie = e.target.getAttribute('categorie')
      const newState = { ...state }

      newState[categorie] = e.target.name
      setState(newState)
    } else {
      const newState = { ...state }
      newState[e.target.name] = e.target.value
      setState(newState)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()

    props.handleForm({
      state: state,
      checkbox: checkbox
    })
  }

  return (
    <div>
      {props.fields.map(field => {
        if (field.type === 'text') {
          return _renderText({
            elem: field,
            placeholder: context.store.user[field.name]
          })
        } else if (field.type === 'checkbox') {
          return _renderCheckbox(field)
        } else if (field.type === 'radio') {
          return _renderRadio(field)
        } else {
          return _renderText({
            elem: field
          })
        }
      })}
      <Button onClick={handleSubmit}> Valider </Button>
      <Content size={'small'} style={{ color: 'red' }}>
        {props.msg[1] === 'danger' && props.msg[0]}
      </Content>
    </div>
  )
}

export default FormConstructor
