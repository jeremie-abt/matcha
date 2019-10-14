import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import FormConstructor from '../FormConstructor'
import classNames from 'classnames'
import axios from 'axios'
import UserContext from '../../../context/UserContext'
import { Button } from 'react-bulma-components'

import MatchaModal from '../../../components/miscellaneous/Modal'

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
      data: fields,
      msg: []
    }
  }

  handleNewPassword = e => {
    axios
      .post(
        '/auth/sendTokenMail',
        {
          redirectionLink: 'http://localhost:3000/changePassword/',
          id: this.context.store.user.id,
          email: this.context.store.user.email
        },
        { withCredentials: true }
      )
      .then(resp => {
        // affichage
        console.log('not implemeted ...')
      })
      .catch(e => {
        // afficahge
        console.log('not implemeted ...')
      })
  }

  setMsg = val => {
    this.setState({ msg: val })
  }

  render() {
    const buttonStyle = {
      classes: classNames({
        'is-primary': true,
        'is-medium': true
      })
    }
    return (
      <div>
        {Object.entries(this.state.msg).length !== 0 && (
          <MatchaModal
            color={this.state.msg[1]}
            msg={this.state.msg[0]}
            setMsg={this.setMsg}
          >
            {this.state.msg}
          </MatchaModal>
        )}
        <FormConstructor
          buttonStyle={buttonStyle}
          fields={this.state.data}
          handleForm={this.handleSubmit}
          msg={this.state.msg}
        />
        <Button onClick={this.handleNewPassword}> Change your password</Button>
      </div>
    )
  }

  handleSubmit = ({ state, checkbox }) => {
    const formData = { ...state, ...checkbox }

    axios
      .put('/users/' + this.context.store.user.id, { ...formData })
      .then(resp => {
        if (resp.status === 200) {
          this.context.updateState(formData)
        }
      })
      .catch(e => {
        this.setState({ msg: ['Something Went wrong please retry', 'danger'] })
      })
  }
}

export default FormUpdateProfil
