import React from 'react'
import { OpenModal } from '../miscellaneous/ReportModal'
import { Modal, Section } from 'react-bulma-components'
import FormUpdatePassword from '../Form/formComponent/FormUpdatePassword'

const ChangePasswordModal = ({ show, setShowModal }) => {
  return (
    <OpenModal
      modal={{ closeOnEsc: true, closeOnBlur: true, showclose: true }}
      show={show}
      setShowModal={setShowModal}
    >
      <Modal.Content>
        <Section className='modal-content'>
          <FormUpdatePassword />
        </Section>
      </Modal.Content>
    </OpenModal>
  )
}

export default ChangePasswordModal
