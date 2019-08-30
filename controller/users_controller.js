// connection aux modele
let user_model = require("../model/users_model")


// mapper sur /api/user/id en get
module.exports.index = function(req, res) {
  if (!("user_id" in req.params)){
    throw "user_id not given ! Report this beug";
  }
  user_id = req.params.user_id
  req_promise = user_model.get_user_from_id(user_id)
  req_promise
    .then((response) => {
      if (response.rows.length != 1) {
        throw "found several users, you should report this beug"
      }
      //res.json(response.rows[0])
      bind = response.rows[0]
      response_object = {
          firstname: bind.firstname,
          lastname: bind.lastname
      }
      res.render("users/index", response_object)
    }).catch(e => { throw e })
  // faire intervenir des view correct
}

// mapper sur /api/user/id en post
module.exports.create = function(req, res) {
  // recup les infos en post et faire la creation de profil
  // verifier de maniere solide qu'il n'est pas deja co
  // qu'il n'est pas deja en attente

  // pour l'instant ce que je vais faire c'est simplement 
  // faire une requette select pour cette id et si ca me retourne 
  // 0 rows c'est ok 
  req_promise = user_model.get_user_from_id(user_id)
  req_promise
    .then((response) => {
      if (response.rows.length != 0) {
        response.render("views/index", {
          errors: ["profil already created"]
        })
      }
    })
    .catch(e => { throw e })
  res.write("not implemented Yet")
  res.end()
}

module.exports.udpate = function(req, res) {
  res.write("not implemented Yet")
  res.end()
}

module.exports.delete = function(req, res) {
  res.write("not implemented Yet")
  res.end()
}
