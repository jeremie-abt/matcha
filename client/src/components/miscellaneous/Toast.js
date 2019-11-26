import React from 'react'
import { useToasts } from 'react-toast-notifications'

const Toaster = ({ type, msg }) => {
  const { addToast } = useToasts()

  const error = addToast()
  return 'hello'
}

export default Toast
