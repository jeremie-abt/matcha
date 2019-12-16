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
    default:
      //content = "don't know what the fuck i'm doing"
      break
  }
  return content
}

module.exports = manageNotif
