const logMessage = require("../logger")
const { getUser } = require("../utils/common")

const userAuth = async (req, res, next) => {
    const user = await getUser(req.headers.authorization)
    if(user){
        req.userId = user.id
        req.userEmail = user.email
        next()
    }else{
        logMessage('error', 'Unauthorized', 'auth-userAuth')
        res.status(401).json({ error: 'Unauthorized' })
    }
}

module.exports = { userAuth }