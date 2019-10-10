import React from 'react'
import { Modal, Notification } from 'react-bulma-components'

function MatchaModal({ setMsg, ...props }) {
  const close = setMsg => {
    setMsg([])
  }

  return (
    <Modal show={true} onClose={() => close(setMsg)} {...props}>
      <Modal.Card>
        <Notification color={props.color}>{props.msg}</Notification>
      </Modal.Card>
    </Modal>
  )
}

export default MatchaModal
