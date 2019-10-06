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

  constructor(props) {
    super(props)
    this.state = {
      data: fields
    }
  }

  render() {
    const buttonStyle = {
      classes: classNames({
        'is-primary': true,
        'is-medium': true
      })
    }
    //const data = this._updateData(this.context.store.user)
    return (
      <FormConstructor
        buttonStyle={buttonStyle}
        fields={this.state.data}
        handleForm={this.handleSubmit}
      />
    )
  }

  handleSubmit = ({state, checkbox}) => {
    
    const formData = {...state, ...checkbox}
    axios
      .put('/users/' + this.context.store.user.id, { ...formData })
      .then(resp => {
        if (resp.status === 200) {
          // transformation de formData.tags en tableau
          console.log("formdata iiciicic : ", formData)
          this.context.updateState(formData)
        }
      })
      .catch(e => {
        throw e
      })
  }
}

export default FormUpdateProfil
