const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const knex = require('../database/connection');

const hashPassword = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

const comparePassword = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
}

const getUser = async (token) => {
    try {
        return jwt.verify(token.split(" ")[1], process.env.TOKEN_HASH)
    } catch (error) {
        return null
    }
}

const getPostData = async (req, onlyOwner = false) => {
    const id = req.params.id

    if(!id) throw Error('post id invalid!')

    const user_id = req.userId

    const where = onlyOwner ? { id, user_id } : { id }

    const post = await knex('posts').where(where).first()

    if(!post) throw Error('Post not found')

    return { id, user_id, post }
}

const getCommentData = async (req, onlyOwner = false) => {
    const id = req.params.id

    if(!id) throw Error('comment id invalid!')

    const user_id = req.userId

    const where = onlyOwner ? { id, user_id } : { id }

    const comment = await knex('comments')
        .where(where)
        .whereNull('deleted_at')
        .first()

    if(!comment) throw Error('Comment not found')

    const post = await knex('posts').where({ id: comment.post_id }).first()

    if(!post) throw Error('Post not found')

    return { id, user_id, post, comment }
}

module.exports = { hashPassword, comparePassword, getUser, getPostData, getCommentData }