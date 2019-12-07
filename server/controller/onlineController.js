const onlineModel = require('../model/onlineModel')

const index = (req, res) => {
    const userId = parseInt(req.params.userId, 10)

    onlineModel.getOnlineUser(userId)
    .then(resp => {
        res.json(resp.rows[0])
    })
    .catch(e => {
        console.log("ERROR : ", e)
    })
}

module.exports = {
    index
}
