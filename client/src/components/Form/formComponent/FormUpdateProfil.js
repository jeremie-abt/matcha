import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css'
import FormConstructor from '../FormConstructor'
import axios from 'axios'

let fields = [
  {
    name: "firstname",
    label: "firstname",
    type: "text"
  },
  {
    name: "lastname",
    label: "lastname",
    type: "text"
  },
  {
    name: "username",
    label: "username",
    type: "text"
  },
  {
    name: "email",
    label: "email",
    type: "email"
  },
  {
    name: "password",
    label: "password",
    type: "password"
  },
  {
    name: "confirmpassword",
    label: "confirmpassword",
    type: "password"
  },
  {
    name: "sexe",
    title: "sexual_oriantation",
    type: "checkbox",
    checkboxValues: ["male", "female"]
  },
  {
    name: "goelocalisation",
    label: "geolocalisation",
    type: "text"
  },
  {
    name: "tags",
    title: "Tags",
    type: "checkbox",
    checkboxValues: []
  },
  {
    name: "bio",
    label: "Bio",
    type: "text",
  }
]

class FormUpdateProfil extends React.Component {

  
  constructor() {
    super()
    this.state = {}
    this.state["data"] = fields
  }

  componentDidMount() {
    // Normalement je devrais avoir un context avec le user_id 
    // s'il est connecte
    let contextUserId = 33

    axios.get('/users/' + contextUserId)
      .then(resp => {
        this._updateData(resp.data)
      })
      .catch(err => { throw err })
    axios.get("/tags/all")
      .then(resp => {
        const newData = [...this.state.data]
        let input = newData.find(elem => elem.name === "tags")
        input.checkboxValues = resp.data
        this.setState({data: newData})
      })
      .catch(err => { throw err })
  }

  render() {
    return (
      <FormConstructor
          fields={ this.state.data }
          handleForm={ this.handleSubmit } />
    )
  }

  handleSubmit = (formData) => {
    console.log("ici form Data : ", formData)
    alert("Not implemented")
  }

  _updateData(newData) {
    
    // New Data Object avec certaines keys
    // this.state.data : tab d'objet, chacun de ces object contient une var name
    // qui va faire la jonction avec le newData

    const keysname = Object.keys(newData)

    function __managedefault(newElem) {
      return newElem
    }

    function __managetext(newElem) {

      newElem["placeholder"] = newData[newElem.name]
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
        const funcPtr = (
          Object.keys(funcTabPtr).indexOf(elem.type) > -1 ?
          funcTabPtr[elem.type] :
          funcTabPtr["default"]
        )
        return funcPtr({ ...elem })
      }
      return null
    })
    this.setState({ data: updatedData })
  }
}

export default FormUpdateProfil
