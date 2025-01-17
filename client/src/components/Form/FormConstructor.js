import React, { useContext, useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Form, Columns, Tag } from 'react-bulma-components'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import InputComponent from './InputStyle/InputStyle'
import Checkbox from './InputStyle/CheckboxStyle'
import MyRadio from './InputStyle/RadioStyle'
import Range from './InputStyle/InputDoubleRange'
import Slider from './InputStyle/InputSlider'
import MyDatePicker from "../miscellaneous/MyDatePicker"
import { useToasts } from 'react-toast-notifications'


import UserContext from '../../context/UserContext'

function FormConstructor({ location, ...props }) {
  const context = useContext(UserContext)
  const [state, setState] = useState({})
  const [checkbox, setCheckbox] = useState({})
  const [currentDate, setCurrentDate] = useState(
    context.store.user.birthdate ?
    new Date(context.store.user.birthdate) :
    new Date()
  )
  const { addToast } = useToasts()

  useEffect(() => {
    if (props.msg && props.msg.length === 2) {
      addToast(props.msg[0], {
        appearance: props.msg[1],
        autoDismiss: true
      })
    }
  }, [props.msg, addToast])

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
        <Columns.Column key={elem.name + elem.label}>
          <Slider
            label={elem.name}
            name={elem.name}
            range={state[elem.name]}
            onChange={handleChange}
            defaultValue={elem.defaultValue}
            key={elem.name + 'slider'}
          />
        </Columns.Column>
      )
    } else {
      return null
    }
  }

  const _renderRange = elem => {
    if (state[elem.name]) {
      return (
        <Columns.Column key={elem.name + elem.label}>
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
        </Columns.Column>
      )
    } else {
      return null
    }
  }

  const _renderText = ({ elem, placeholder }) => {
    
    return (
      <InputComponent
        defaultInfo={context.store.user[elem.name]}
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
      <Columns.Column key={elem.name + elem.title}>
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

  const _renderDatepicker = elem => {
    return (
      <MyDatePicker
        key={'saucissesamouraibiggy'}
        title={elem.name}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
    )
  }

  const _renderCheckbox = elem => {
    let checkboxComponent

    if (checkbox[elem.name]) {
      return (
        <Columns.Column size={12} key={elem.name + elem.title}>
          <Form.Field key={elem.name + elem.type}>
            <Form.Control>
              <Form.Label>{elem.title}</Form.Label>
              {
                // le data-key est la car je n'arrive pas a
                // access l'attribute key dans handlechange
              }
              <Tag.Group>
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
              </Tag.Group>
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
    } else if (e.target.type === 'checkbox' || !e.target.type) {
      // !e.target.type is for style tags in search
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
      state,
      checkbox,
      currentDate
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
          } else if (field.type === 'datepicker') {
            return _renderDatepicker(field)
          } else {
            return _renderText({
              elem: field
            })
          }
        })}
      </Columns>
      <Button className='is-primary' onClick={handleSubmit}>
        {location.pathname === '/account' ? 'Valider' : 'Rechercher'}
      </Button>
    </div>
  )
}

export default withRouter(FormConstructor)
