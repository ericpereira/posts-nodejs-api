const logMessage = require("../logger");
const { getPostData } = require("../utils/common");
const knex = require('../database/connection')

const insert = async (req, res) => {
    try {
        const { title, description } = req.body

        if(!description) throw Error('post description is invalid!')
        
        const user_id = req.userId

        await knex('posts').insert({ title, description, user_id })
            .then(response => {
                logMessage('info', 'Post inserted', 'controller-posts')
                res.status(201).json({ msg: 'Post inserted' })
            })
            .catch(error => {
                throw Error(error.sqlMessage)
            })        
    } catch (error) {
        logMessage('error', error.message, 'controller-posts')
        res.status(400).json({ error: error.message })
    }
}

const update = async (req, res) => {
    try {
        
        const { id } = await getPostData(req, true)
        
        const { title, description } = req.body

        let updateObject = {}
        
        if(title) updateObject = { title }
        if(description) updateObject = { ...updateObject, description }
        

        await knex('posts')
            .where({ id })
            .update({...updateObject, updated_at: new Date()})
            .then(response => {
                logMessage('info', 'Post updated', 'controller-posts')
                res.status(204).json({ msg: 'Post updated' })
            })
            .catch(error => {
                throw Error(error.sqlMessage)
            })        
    } catch (error) {
        logMessage('error', error.message, 'controller-posts')
        res.status(400).json({ error: error.message })
    }
}

const get = async (req, res) => {
    try {        
        const id = req.params.id

        if(!id) throw Error('post id invalid!')

        const post = await knex('posts')
            .select(
                'posts.id as id',
                'posts.title',
                'posts.description',
                'posts.user_id as user_id',
                'created_at',
                knex('posts_views')
                    .count('*')
                    .whereRaw('?? = ??', ['posts_views.post_id', 'posts.id'])
                    .as('views'),
                knex('posts_likes')
                    .count('*')
                    .whereRaw('?? = ??', ['posts_likes.post_id', 'posts.id'])
                    .as('likes'),
                knex('posts_unlikes')
                    .count('*')
                    .whereRaw('?? = ??', ['posts_unlikes.post_id', 'posts.id'])
                    .as('unlikes')
            )
            .where({ id })
            .first()

        if(!post) throw Error('Post not found')

        logMessage('info', 'Post info', 'controller-posts')
        res.status(200).json(post)       
    } catch (error) {
        logMessage('error', error.message, 'controller-posts')
        res.status(400).json({ error: error.message })
    }
}

const getAll = async (req, res) => {
    try {
        await knex('posts')
            .select(
                'posts.id as id',
                'posts.title',
                'posts.description',
                'posts.user_id as user_id',
                'created_at',
                knex('posts_views')
                    .count('*')
                    .whereRaw('?? = ??', ['posts_views.post_id', 'posts.id'])
                    .as('views'),
                knex('posts_likes')
                    .count('*')
                    .whereRaw('?? = ??', ['posts_likes.post_id', 'posts.id'])
                    .as('likes'),
                knex('posts_unlikes')
                    .count('*')
                    .whereRaw('?? = ??', ['posts_unlikes.post_id', 'posts.id'])
                    .as('unlikes')
            )
            .orderBy('id', 'desc')
            .then(response => {
                logMessage('info', 'User updated', 'controller-posts')
                res.status(200).json({ posts: response })
            })
            .catch(error => {
                throw Error(error.sqlMessage)
            })        
    } catch (error) {
        logMessage('error', error.message, 'controller-posts')
        res.status(400).json({ error: error.message })
    }
}

const remove = async (req, res) => {
    try {        
        const { id } = await getPostData(req, true)

        await knex('posts')
            .where({ id })
            .del()
            .then(response => {
                logMessage('info', 'Post deleted successfully', 'controller-posts')
                res.status(200).json({ msg: 'Post deleted successfully' })
            })
            .catch(error => {
                throw Error(error.sqlMessage)
            })
    } catch (error) {
        logMessage('error', error.message, 'controller-posts')
        res.status(400).json({ error: error.message })
    }
}

const saveView = async (req, res) => {
    try {
        const { id, user_id } = await getPostData(req)

        await knex('posts_views').insert({ post_id: id, user_id })
            .then(response => {
                logMessage('info', 'Post View inserted', 'controller-posts')
                res.status(201).json({ msg: 'Post View inserted' })
            })
            .catch(error => {
                throw Error(error.sqlMessage)
            })        
    } catch (error) {
        logMessage('error', error.message, 'controller-posts')
        res.status(400).json({ error: error.message })
    }
}

const saveLike = async (req, res) => {
    try {
        const { id, user_id } = await getPostData(req)

        //if already liked this post, don't do anything
        const like = await knex('posts_likes').where({ post_id: id, user_id }).first()
        
        if(like){
            res.status(204).json({ msg: 'Post already liked' })
        }else{
            //if have unliked this post before, remove then
            const unlike = await knex('posts_unlikes').where({ post_id: id, user_id }).first()
            if(unlike) await knex('posts_unlikes').where({ post_id: id, user_id }).del()

            await knex('posts_likes').insert({ post_id: id, user_id })
                .then(response => {
                    logMessage('info', 'Post like inserted', 'controller-posts')
                    res.status(201).json({ msg: 'Post like inserted' })
                })
                .catch(error => {
                    throw Error(error.sqlMessage)
                })
        }        
    } catch (error) {
        logMessage('error', error.message, 'controller-posts')
        res.status(400).json({ error: error.message })
    }
}

const saveUnlike = async (req, res) => {
    try {
        const { id, user_id } = await getPostData(req)

        //if already unliked this post, don't do anything
        const unlike = await knex('posts_unlikes').where({ post_id: id, user_id }).first()
        
        if(unlike){
            res.status(204).json({ msg: 'Post already unliked' })
        }else{
            //if have liked this post before, remove then
            const like = await knex('posts_likes').where({ post_id: id, user_id }).first()
            if(like) await knex('posts_likes').where({ post_id: id, user_id }).del()

            await knex('posts_unlikes').insert({ post_id: id, user_id })
                .then(response => {
                    logMessage('info', 'Post unlike inserted', 'controller-posts')
                    res.status(201).json({ msg: 'Post unlike inserted' })
                })
                .catch(error => {
                    throw Error(error.sqlMessage)
                })
        }        
    } catch (error) {
        logMessage('error', error.message, 'controller-posts')
        res.status(400).json({ error: error.message })
    }
}

module.exports = { insert, update, get, getAll, remove, saveView, saveLike, saveUnlike }