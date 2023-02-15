const controllers = require('../controllers/posts.js')
const { userAuth } = require('../middleware/auth.js')
const router = require('express').Router()

router.get('/posts', userAuth, controllers.getAll)
router.get('/posts/:id', userAuth, controllers.get)
router.post('/posts', userAuth, controllers.insert)
router.post('/posts/:id/view', userAuth, controllers.saveView)
router.post('/posts/:id/like', userAuth, controllers.saveLike)
router.post('/posts/:id/unlike', userAuth, controllers.saveUnlike)
router.patch('/posts/:id', userAuth, controllers.update)
router.delete('/posts/:id', userAuth, controllers.remove)

module.exports = router