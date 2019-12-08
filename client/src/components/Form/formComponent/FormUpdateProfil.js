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
