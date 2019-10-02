import React from 'react'
import UserContext from './UserContext'

class MyProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      isAuth: true
    }

    this.updateState = this.updateState.bind(this)
    this.updateIsAuth = this.updateIsAuth.bind(this)
  }

  updateState(user) {
    this.setState({ user })
  }

  updateIsAuth() {
    this.setState({ isAuth: true })
  }

  render() {
    return (
      <UserContext.Provider
        value={{
          store: this.state,
          updateState: this.updateState,
          updateIsAuth: this.updateIsAuth
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export default MyProvider
