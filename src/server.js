require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const usersRoutes = require('./routes/users')
const postsRoutes = require('./routes/posts')
const commentsRoutes = require('./routes/comments')

const app = express()



app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

//import cors
//import lib to upload images

app.get('/', (req, res) => {
    res.status(200).json({ msg: 'eae men kk' })
})

app.use(usersRoutes)
app.use(postsRoutes)
app.use(commentsRoutes)

const port = process.env.PORT || '3000'

app.listen(port, () => {
    console.log(`Server listen on port ${port}`)
})
