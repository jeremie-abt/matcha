import React from 'react'
import { Modal, Notification } from 'react-bulma-components'

function MatchaModal(props) {
  const close = setMsg => {
    setMsg([])
  }

  if (props.color === 'success') {
    if (props.setMsg === undefined) {
      return (
        <Modal show={true} {...props}>
          <Modal.Card>
            <Notification color={props.color}>{props.msg}</Notification>
          </Modal.Card>
        </Modal>
      )
    } else {
      return (
        <Modal show={true} onClose={() => close(props.setMsg)} {...props}>
          <Modal.Card>
            <Notification color={props.color}>{props.msg}</Notification>
          </Modal.Card>
        </Modal>
      )
    }
  } else {
    return null
  }
}

export default MatchaModal
