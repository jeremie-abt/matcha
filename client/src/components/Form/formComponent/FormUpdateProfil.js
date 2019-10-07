import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import FormConstructor from '../FormConstructor'
import classNames from 'classnames'
import axios from 'axios'
import UserContext from '../../../context/UserContext'

let fields = [
  {
    name: 'firstname',
    label: 'firstname',
    type: 'text'
  },
  {
    name: 'lastname',
    label: 'lastname',
    type: 'text'
  },
  {
    name: 'username',
    label: 'username',
    type: 'text'
  },
  {
    name: 'email',
    label: 'email',
    type: 'email'
  },
  {
    name: 'password',
    label: 'password',
    type: 'password'
  },
  {
    name: 'confirmpassword',
    label: 'confirmpassword',
    type: 'password'
  },
  {
    name: 'gender',
    title: 'Gender',
    type: 'radio',
    radioValues: ['male', 'female']
  },
  {
    name: 'goelocalisation',
    label: 'geolocalisation',
    type: 'text'
  },
  {
    name: 'tags',
    title: 'Tags',
    type: 'checkbox',
    checkboxValues: []
  },
  {
    name: 'bio',
    label: 'Bio',
    type: 'text'
  }
]

class FormUpdateProfil extends React.Component {
  static contextType = UserContext

  componentDidMount() {
    // Normalement je devrais avoir un context avec le user_id
    // s'il est connecte

    axios
      .get('/tags/all')
      .then(resp => {
        const newData = [...this.state.data]
        let input = newData.find(elem => elem.name === 'tags')
        input.checkboxValues = resp.data
        this.setState({ data: newData })
      })
      .catch(err => {
        throw err
      })
  }

  constructor(props, context) {
    super(props)
    this.state = {
      data: this._constructInputs(context)
    }
  }

  _constructInputs(context) {
    // merge le context avec field

    const userContext = context.store.user

    const transformationHandler = {
      managetext: elem => {
        return { ...elem, placeholder: userContext[elem.name] }
      },
      managecheckbox: elem => {
        return {
          ...elem,
          'data-checkbox-activated': userContext[elem.name]
        }
      },
      manageradio: elem => {
        return {
          ...elem,
          'data-radio-curval': userContext[elem.name]
        }
      }
    }
    let ret = fields.map(elem => {
      if ('manage' + elem.type in transformationHandler) {
        return transformationHandler['manage' + elem.type](elem, this)
      }
      return elem
    })
    return ret
  }

  render() {
    const buttonStyle = {
      classes: classNames({
        'is-primary': true,
        'is-medium': true
      })
    }
    const data = this._updateData(this.context.store.user)
    return (
      <FormConstructor
        buttonStyle={buttonStyle}
        fields={data}
        handleForm={this.handleSubmit}
      />
    )
  }

  handleSubmit = formData => {
    axios
      .put('/users/' + this.context.store.user.id, { ...formData })
      .then(resp => {
        if (resp.status === 200) {
          // transformation de formData.tags en tableau
          if ('tags' in formData) {
            formData.tags = Object.keys(formData.tags)
          }
          this.context.updateState(formData)
        }
      })
      .catch(e => {
        throw e
      })
  }

  _updateData(newData) {
    // New Data Object avec certaines keys (mon context)
    // this.state.data : tab d'objet, chacun de ces object contient une var name
    // qui va faire la jonction avec le newData

    const keysname = Object.keys(newData)

    function __managedefault(newElem) {
      return newElem
    }

    function __managetext(newElem) {
      newElem['placeholder'] = newData[newElem.name]
      return newElem
    }

    function __managecheckbox(newElem) {
      return newElem
    }

    const funcTabPtr = {
      text: __managetext,
      email: __managetext,
      checkbox: __managecheckbox,
      default: __managedefault
    }

    let updatedData = this.state.data.map(elem => {
      if (keysname.indexOf(elem.name > -1)) {
        // ...new elem syntax is made in order to copy object
        const funcPtr =
          Object.keys(funcTabPtr).indexOf(elem.type) > -1
            ? funcTabPtr[elem.type]
            : funcTabPtr['default']
        return funcPtr({ ...elem })
      }
      return null
    })
    return updatedData
  }
}

export default FormUpdateProfil
