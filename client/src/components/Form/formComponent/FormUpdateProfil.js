import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import FormConstructor from '../FormConstructor'
import classNames from 'classnames'
import axios from 'axios'
import UserContext from '../../../context/UserContext'
import ChangePasswordModal from '../../miscellaneous/ChangePasswordModal'
import { Button, Card } from 'react-bulma-components'

import MatchaModal from '../../../components/miscellaneous/Modal'

let fields = [
  {
    name: 'firstname',
    label: 'Firstname',
    type: 'text'
  },
  {
    name: 'lastname',
    label: 'Lastname',
    type: 'text'
  },
  {
    name: 'username',
    label: 'Username',
    type: 'text'
  },
  {
    name: 'email',
    label: 'email',
    type: 'email'
  },
  {
    name: 'gender',
    title: 'Gender',
    type: 'radio',
    radioValues: ['male', 'female']
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
          {
            !this.context.store.isProfilCompleted &&
            <h1 class="completeProfil"> 
              Vous devez completer votre profil
            </h1>
          }
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
  removeNullStrings = (args) => {
    const after = {}
    let trimmedFields = false
    Object.keys(args).forEach((elem) => {
      if (typeof args[elem] !== 'string') {
        after[elem] = args[elem]
      } else if (args[elem] && args[elem].trim() !== "") {
        after[elem] = args[elem]
      } else {
        trimmedFields = true
      }
    })
    return [after, trimmedFields]
  }

  verifyFormData(formData) {
    const { email } = formData
    const verifyMailPattern = RegExp('^.{1,25}@.{2,15}\\.[^.]{2,4}$')
    if (!verifyMailPattern.exec(email))
      return 'please send a valid email ...'
    // faudrait faire gaff a la date
    return true
  }

  handleSubmit = ({ state, checkbox }) => {

    let formData = { ...state, ...checkbox }
    let ret = this.removeNullStrings(formData)
    formData = ret[0]
    if (ret[1] === true) this.setState({msg : ['invalid blank messages', 'danger']})
    ret = this.verifyFormData(formData)
    if (ret === true) {
      axios
        .put('/users/' + this.context.store.user.id, { ...formData })
        .then(resp => {
          if (resp.status === 200) {
            this.context.updateUser(formData)
          }
        })
        .catch(e => {
          this.setState({ msg: ['Something Went wrong please retry', 'danger'] })
        })
    } else {
      this.setState({msg: [ret, 'danger']})
    }
  }
}

export default FormUpdateProfil
