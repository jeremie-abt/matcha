import React from 'react'
import axios from 'axios'

class Image extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      url: ''
    }
  }
  async componentDidMount() {
    this.state.url = 
      await axios
        .get('/2/images')
        .then(({ data: { url } }) => {
          this.setState({ url: url })
        })
        .catch(err => { throw err })
  }

  render() {
    return (
      <img src={this.state.url} alt=""/>
    )
  }
}

export default Image
