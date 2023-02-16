const controllers = require('../controllers/comments.js')
const { userAuth } = require('../middleware/auth.js')
const router = require('express').Router()

router.get('/comments/:id', userAuth, controllers.getAll) //here the id is the id of the post which comment belong
router.post('/comments/:id', userAuth, controllers.insert) //here the id is the id of the post which comment belong
router.patch('/comments/:id', userAuth, controllers.update)
router.post('/comments/:id/remove', userAuth, controllers.remove)

module.exports = router