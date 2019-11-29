import React from 'react'
import { Columns, Box } from 'react-bulma-components'

function MessageBubble({ MessageInfo, currentUserId }) {
  let className
  if (currentUserId === MessageInfo.sender_id) {
    className = 'chat-sender'
  } else {
    className = 'chat-receiver'
  }
  return (
    <Columns.Column>
      <Box className={className}>
        <p>{MessageInfo.message}</p>
      </Box>
    </Columns.Column>
  )
}

export default MessageBubble
