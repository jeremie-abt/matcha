import React from 'react'
import { Form, Button } from 'react-bulma-components'

// je sais pas si ca doit allez dans un dossier button
// ou ici comme ca appartient au form
// En vraie je pense qu'il faut une couche d'abstraction 
// en plus car le pattern de composition n'est pas trop
// respecte : c'est un UI component, sauf qu'il combine deux
// logiques

/**
 *    UI component : submit button for Form
 */

function SubmitButton( {...props} ) {
  
  console.log("voici les props : ", props)
  return (
    <Button {...props}> Valider </Button>
  )
}

export default SubmitButton
