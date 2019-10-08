import React from 'react'

function TokenHandlingPage({action, ...props}) {
  if (action === "verifyaccount") {
    console.log("hophophop on verifie")
    console.log("props : ", props)
  }
}

export default TokenHandlingPage
