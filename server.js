const express = require("express")
const app = express()
// temporaire a voir comment faire des imports propres.

const api_router = require("./api_router")

// template engine
app.set('view engine', 'ejs');

app.use('/api', api_router.api_router)

// la je fais mes routes ici comme un gros sale mais bon
// va falloir penser apres a comment les faires

app.listen(8081)
