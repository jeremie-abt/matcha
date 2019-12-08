const client = require('../database/connection')

const getOnlineUser = (userId) => {
    const statement = 'select * from online where user_id = $1'

    return client.query(statement, [userId])
}

const userConnection = (userId) => {
    const statement = 
        "INSERT INTO online (user_id, is_online)" +
        " VALUES($1, $2) ON CONFLICT(user_id) DO " +
        " UPDATE SET is_online=$2"
    
    return client.query(statement, [userId, true])
}

const userDisconnection = (userId) => {
    const statement = 
        "update online set is_online=$1, last_connection=NOW() " + 
        ` WHERE user_id=${userId}`
    
    return client.query(statement, [false])
}

module.exports = {
    getOnlineUser,
    userConnection,
    userDisconnection
}
