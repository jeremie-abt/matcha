import React, { useContext, useState, useEffect } from 'react'

import { Button, Form, Content, Columns } from 'react-bulma-components'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import InputComponent from './InputStyle/InputStyle'
import Checkbox from './InputStyle/CheckboxStyle'
import MyRadio from './InputStyle/RadioStyle'
import Range from './InputStyle/InputDoubleRange'
import Slider from './InputStyle/InputSlider'

import UserContext from '../../context/UserContext'

function FormConstructor(props) {
  const context = useContext(UserContext)
  const [state, setState] = useState({})
  const [checkbox, setCheckbox] = useState({})

  useEffect(() => {
    const checkboxObj = {}
    const stateObj = {}
    props.fields.forEach(elem => {
      if (elem.type === 'checkbox') {
        if (context.store.user[elem.name] !== undefined) {
          checkboxObj[elem.name] = context.store.user[elem.name]
        }
      } else if (elem.type === 'radio') {
        stateObj[elem.name] = context.store.user[elem.name]
      } else if (elem.type === 'range') {
        stateObj[elem.name] = elem.defaultValues
      } else if (elem.type === 'slider') {
        stateObj[elem.name] = elem.defaultValue
      }
    })
    setCheckbox(checkboxObj)
    setState(stateObj)
  }, [context, context.store.user, props.fields])

  const _renderSlider = elem => {
    if (state[elem.name]) {
      return (
        <Slider
          name={elem.name}
          range={state[elem.name]}
          onChange={handleChange}
          defaultValue={elem.defaultValue}
          key={elem.name + 'slider'}
        />
      )
    } else {
      return null
    }
  }

  const _renderRange = elem => {
    if (state[elem.name]) {
      return (
        <Range
          name={elem.name}
          label={elem.label}
          range={state[elem.name]}
          onChange={handleChange}
          defaultValues={elem.defaultValues}
          min={elem.range[0]}
          max={elem.range[1]}
          key={elem.name + 'range'}
        />
      )
    } else {
      return null
    }
  }

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
    return (
      <Columns.Column>
        {elem.radioValues.map(radioElem => {
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
        })}
      </Columns.Column>
    )
  }

  const _renderCheckbox = elem => {
    let checkboxComponent

    if (checkbox[elem.name]) {
      return (
        <Columns.Column size={12}>
          <Form.Field key={elem.name + elem.type}>
            <Form.Control>
              <Form.Label>{elem.title}</Form.Label>

              {
                // le data-key est la car je n'arrive pas a
                // access l'attribute key dans handlechange
              }
              {elem.checkboxValues.map(checkboxElem => {
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
            </Form.Control>
          </Form.Field>
        </Columns.Column>
      )
    } else {
      return null
    }
  }

  /**
   *  Parent of form generation.
   */
  const handleChange = e => {
    let newState = { ...state }
    newState = { ...state }

    if (e.type && (e.type === 'range' || e.type === 'slider')) {
      newState[e.name] = e.value
      setState(newState)
    } else if (e.target.type === 'checkbox') {
      const categorie = e.target.getAttribute('categorie')
      const key = parseInt(e.target.getAttribute('data-key'))

      // this fix issue of link between form
      // checbkox was a ref to context, so this was pushing something directly in the context
      // [... ] structure permit to have a copied object
      let newCurCheckboxObj = [...checkbox[categorie]]
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
      newState[categorie] = e.target.name
      setState(newState)
    } else {
      newState[e.target.name] = e.target.value
      setState(newState)
    }
    if (props.handleChange) {
      props.handleChange({ state: newState })
    }
    // pas ouff ca va etre call tous le temps alors que c une
    // logique tres specifique pour le formFilter
    // donc si tu as une autre idee !
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
      <Columns>
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
          } else if (field.type === 'range') {
            return _renderRange(field)
          } else if (field.type === 'slider') {
            return _renderSlider(field)
          } else {
            return _renderText({
              elem: field
            })
          }
        })}
      </Columns>
      <Button onClick={handleSubmit}> Valider </Button>
      <Content size={'small'} style={{ color: 'red' }}>
        {props.msg &&
          props.msg.length === 2 &&
          props.msg[1] === 'danger' &&
          props.msg[0]}
      </Content>
    </div>
  )
}

export default FormConstructor
