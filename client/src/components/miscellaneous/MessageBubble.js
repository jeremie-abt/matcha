import React from 'react'
import { Columns, Box } from 'react-bulma-components'

function MessageBubble({ MessageInfo, currentUserId }) {
  let className =
    currentUserId === MessageInfo.sender_id ? 'chat-sender' : 'chat-receiver'
  return (
    <Columns.Column>
      <Box className={className}>
        <p>{MessageInfo.message}</p>
      </Box>
    </Columns.Column>
  )
}

export default MessageBubble
