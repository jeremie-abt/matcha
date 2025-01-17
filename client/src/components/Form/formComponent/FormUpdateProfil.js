import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import FormConstructor from '../FormConstructor'
import classNames from 'classnames'
import axios from 'axios'
import UserContext from '../../../context/UserContext'
import ChangePasswordModal from '../../miscellaneous/ChangePasswordModal'
import { Button, Card } from 'react-bulma-components'
import parseFormData from '../../../helpers/validation'

import MatchaModal from '../../../components/miscellaneous/Modal'

let fields = [
  {
    name: 'firstname',
    label: 'prenom',
    type: 'text'
  },
  {
    name: 'lastname',
    label: 'nom',
    type: 'text'
  },
  {
    name: 'username',
    label: 'pseudo',
    type: 'text'
  },
  {
    name: 'email',
    label: 'email',
    type: 'email'
  },
  {
    name: 'gender',
    type: 'radio',
    radioValues: ['male', 'female']
  },
  {
    name: 'tags',
    title: 'Interet',
    type: 'checkbox',
    checkboxValues: []
  },
  {
    name: 'bio',
    label: 'Description',
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
      msg: [],
      showModal: false
    }
  }

  handleModalPassword = () => {
    this.setState({ showModal: !this.state.showModal })
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
        <Card className='card-fullwidth'>
          <Card.Content>
            <div className='is-right'>
              <Button
                className='is-light changePassword'
                rounded
                onClick={this.handleModalPassword}
              >
                Modifier votre mot de passe
              </Button>
            </div>
            <FormConstructor
              buttonStyle={buttonStyle}
              fields={this.state.data}
              handleForm={this.handleSubmit}
              msg={this.state.msg}
            />
            {this.state.showModal && (
              <ChangePasswordModal
                setShowModal={this.handleModalPassword}
                show={this.state.showModal}
              />
            )}
          </Card.Content>
        </Card>
      </div>
    )
  }

  // do we need to tell the user when a stirng is empty ?
  // that it won't be updated in the back ?
  removeNullStrings = args => {
    const after = {}
    let blankMsgs = true
    Object.keys(args).forEach(elem => {
      if (typeof args[elem] !== 'string') {
        after[elem] = args[elem]
        if (elem === 'tags' && args.tags.length > 0) blankMsgs = false
        else if (elem === 'gender' && args.gender) blankMsgs = false
      } else if (args[elem] && args[elem].trim() !== '') {
        blankMsgs = false
        after[elem] = args[elem]
      }
    })
    return [after, blankMsgs]
  }

  handleSubmit = ({ state, checkbox }) => {
    let formData = { ...state, ...checkbox }
    const retNullStrings = this.removeNullStrings(formData)
    formData = retNullStrings[0]
    const retVerify = parseFormData(formData)
    if (retVerify !== true) {
      this.setState({ msg: [retVerify, 'error'] })
      return null
    }
    if (retNullStrings[1] === true) {
      this.setState({ msg: ['invalid blank messages', 'error'] })
      return null
    }
    axios
      .put('/users/' + this.context.store.user.id, { ...formData })
      .then(resp => {
        if (resp.status === 200) {
          this.context.updateUser(formData)
        }
      })
      .catch(e => {
        this.setState({ msg: ['Something Went wrong please retry', 'error'] })
      })
  }
}

export default FormUpdateProfil
