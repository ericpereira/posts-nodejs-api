const logMessage = require("../logger");
const { getPostData, getCommentData } = require("../utils/common");
const knex = require('../database/connection')

const insert = async (req, res) => {
    try {
        const { id, user_id } = await getPostData(req) //here the id is the id of the post which comment belong

        const { description } = req.body

        if(!description) throw Error('comment is invalid!')

        await knex('comments').insert({ description, user_id, post_id: id })
            .then(response => {
                logMessage('info', 'Comment inserted', 'controller-comments')
                res.status(201).json({ msg: 'Comment inserted' })
            })
            .catch(error => {
                throw Error(error.sqlMessage)
            })        
    } catch (error) {
        logMessage('error', error.message, 'controller-comments')
        res.status(400).json({ error: error.message })
    }
}

const update = async (req, res) => {
    try {        
        const { id } = await getCommentData(req, true)

        const { description } = req.body

        let updateObject = {}
        
        updateObject = { description, updated_at: new Date() }

        await knex('comments')
            .where({ id })
            .update(updateObject)
            .then(response => {
                logMessage('info', 'Comment updated', 'controller-comments')
                res.status(204).json({ msg: 'Comment updated' })
            })
            .catch(error => {
                throw Error(error.sqlMessage)
            })
    } catch (error) {
        logMessage('error', error.message, 'controller-comments')
        res.status(400).json({ error: error.message })
    }
}

const getAll = async (req, res) => {
    try {
        const { id } = await getPostData(req)

        await knex('comments')
            .where({ post_id: id })
            .orderBy('id', 'desc')
            .then(response => {
                logMessage('info', 'Comments info', 'controller-comments')
                res.status(200).json({ comments: response })
            })
            .catch(error => {
                throw Error(error.sqlMessage)
            })        
    } catch (error) {
        logMessage('error', error.message, 'controller-comments')
        res.status(400).json({ error: error.message })
    }
}

const remove = async (req, res) => {
    try {        
        const { id, user_id, post, comment } = await getCommentData(req)

        let updateObject = {}
        
        //only remove the comment if the logged user is the owner of the post or the owner of the comment
        if(user_id === post.user_id || user_id === comment.user_id){
            updateObject = { deleted_by: user_id, deleted_at: new Date() }

            await knex('comments')
                .where({ id })
                .update(updateObject)
                .then(response => {
                    logMessage('info', 'Comment deleted', 'controller-comments')
                    res.status(204).json({ msg: 'Comment deleted' })
                })
                .catch(error => {
                    throw Error(error.sqlMessage)
                })
        }else{ //unauthorized to remove this comment
            throw Error('Unauthorized to remove this comment')
        }        
    } catch (error) {
        logMessage('error', error.message, 'controller-comments')
        res.status(400).json({ error: error.message })
    }
}

module.exports = { insert, update, getAll, remove }