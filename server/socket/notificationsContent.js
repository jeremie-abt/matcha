const manageNotif = (io, infos) => {
  let content

  switch (infos.type) {
    case 'seen':
      io.to(`room${infos.receiverId}`).emit('notifPrinting', 'seen')
      break
    case 'like':
      io.to(`room${infos.receiverId}`).emit('likesEmit', infos.userId)
      io.to(`room${infos.receiverId}`).emit('notifPrinting', 'like')
      break
    case 'unlike':
      io.to(`room${infos.receiverId}`).emit('unlikesEmit', infos.userId)
      break
    case 'match':
      io.to(`room${infos.receiverId}`).emit('matchEmit', infos.userId)
      io.to(`room${infos.receiverId}`).emit('notifPrinting', 'match')
      break
    case 'unmatch':
      io.to(`room${infos.receiverId}`).emit('unmatchEmit', infos.userId)
      io.to(`room${infos.receiverId}`).emit('notifPrinting', 'unmatch')
      break
    case 'message':
      io.to(`room${infos.receiverId}`).emit(
        'messageReceived',
        infos.msgMetadata
      )
      io.to(`room${infos.receiverId}`).emit(
        'notifPrinting',
        'message',
        infos.username
      )
      break
    default:
      break
  }
  return content
}

module.exports = manageNotif
