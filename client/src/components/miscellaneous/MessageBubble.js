import React from 'react'
import { Columns, Box } from 'react-bulma-components'
import Moment from 'react-moment'

function MessageBubble({ MessageInfo, userInfos, isCurrentUser }) {
  let className = isCurrentUser
    ? 'chat-msg chat-sender'
    : 'chat-msg chat-receiver'

  return (
    <Columns.Column
      size={'two-thirds'}
      offset={isCurrentUser ? 'one-quarter' : ''}
    >
      <Box className={className}>
        <h1>{userInfos.username} </h1>
        <p>{MessageInfo.message}</p>
        <p className='chat-date'>
          <Moment fromNow date={MessageInfo.send_at} />
        </p>
      </Box>
    </Columns.Column>
  )
}

export default MessageBubble
