const client = require("../database/connection")

// return Promise of the request
function    get_user_from_id(id) {
    statement = `SELECT * FROM users `
                + `WHERE user_id = $1;`
    // demander si c'est une bonne fasons le faire ??
    p_req = client.query(statement, [ id ])
    p_req.catch((err) => { throw err })
    return client.query(statement, [ id ])
}

function    is_user_already_created(user_info) {
    // verifie qu'il n'y ait pas un coupe firstname lastname identique
    // verif que l'email n'existe pas deja
    // variable needed in user_info 
    // firstname / lastname / email

    let statement = `SELECT * FROM users `
        + `WHERE (firstname=$1 AND lastname=$2) `
        + `OR username = $3 `
        + `OR email=$4`
    const values = [ user_info.firstname, user_info.lastname,
        user_info.username, user_info.email ]
    let p_req = client.query(statement, values)
    p_req.catch((err => { throw err }))
    return p_req
}

function create_user(user_info) {
    // hardcode
    // field used :  
    // firstname / lastname / password / username / email

    let statement = `INSERT INTO users`
        + `(firstname, lastname, password, username, email) `
        + `VALUES ($1, $2, $3, $4, $5)`
    const values = [ user_info.firstname, user_info.lastname,
        user_info.password, user_info.username, user_info.email ]
    let p_req = client.query(statement, values)
    p_req.catch((err) => {throw err})
    return p_req
}


module.exports = {
    get_user_from_id,
    is_user_already_created,
    create_user
}