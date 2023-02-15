const controllers = require('../controllers/users.js')
const { userAuth } = require('../middleware/auth.js')
const router = require('express').Router()

router.get('/users', userAuth, controllers.getAll)
router.get('/users/:id', userAuth, controllers.get)
router.post('/users', controllers.insert)
router.post('/users/auth', controllers.login)
router.patch('/users/:id', userAuth, controllers.update)
router.delete('/users/:id', userAuth, controllers.remove)

module.exports = router