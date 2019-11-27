import React, { useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import axios from 'axios'
import { Modal, Section, Button, Form } from 'react-bulma-components'
import PropTypes from 'prop-types'

class OpenModal extends React.Component {
  static propTypes = {
    modal: PropTypes.object,
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    modal: {}
  }

  close = () => this.props.setShowModal(false)

  render() {
    return (
      <div>
        <Modal
          show={this.props.show}
          onClose={this.close}
          {...this.props.modal}
        >
          {this.props.children}
        </Modal>
      </div>
    )
  }
}

function ReportModal({
  userId,
  reportedId,
  show,
  setShowModal,
  updateProfils
}) {
  const { addToast } = useToasts()
  const [msg, setMsg] = useState('')

  const valueReport = [
    'Discours Haineux (racisme, discrimination...',
    'Harcèlement',
    'Contenu indésirable',
    'Fausses informations',
    'Faux compte'
  ]

  const handleChange = e => {
    setMsg(e.target.value)
  }

  const handleSubmit = () => {
    if (msg) {
      axios
        .post('/reports/add', { userId, reportedId, report: msg })
        .then(result => {
          if (result.status === 200) {
            addToast('Reporter avec succès', {
              appearance: 'success',
              autoDismiss: true
            })
            setShowModal(false)
            updateProfils(reportedId)
          }
        })
        .catch(err => {
          addToast('An error occured during the report', {
            appearance: 'error',
            autoDismiss: true
          })
          throw err
        })
    } else {
      addToast('Merci de choisir une catégorie', {
        appearance: 'error',
        autoDismiss: true
      })
    }
  }
  return (
    <OpenModal
      modal={{ closeOnEsc: true, closeOnBlur: true, showclose: true }}
      show={show}
      setShowModal={setShowModal}
    >
      <Modal.Content>
        <Section className='modal-content'>
          <Form.Field>
            <Form.Label>Reporter l'utilisateur pour:</Form.Label>
            <Form.Control>
              <Form.Select onChange={handleChange} name='report' value={msg}>
                <option>Select dropdown</option>
                <option value={valueReport[0]}>{valueReport[0]}</option>
                <option value={valueReport[1]}>{valueReport[1]}</option>
                <option value={valueReport[2]}>{valueReport[2]}</option>
                <option value={valueReport[3]}>{valueReport[3]}</option>
                <option value={valueReport[4]}>{valueReport[4]}</option>
              </Form.Select>
            </Form.Control>
          </Form.Field>
          <Form.Field>
            <Form.Control>
              <Button onClick={handleSubmit}> Submit </Button>
            </Form.Control>
          </Form.Field>
        </Section>
      </Modal.Content>
    </OpenModal>
  )
}

export default ReportModal
