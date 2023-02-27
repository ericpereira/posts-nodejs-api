const logMessage = require("../logger");
const { hashPassword, comparePassword } = require("../utils/common");
const knex = require('../database/connection')
const jwt = require('jsonwebtoken');

const insert = async (req, res) => {
    try {
        const { name, email, password } = req.body
        
        if(!name) throw Error('name is invalid!')
        if(!email) throw Error('email is invalid!')
        if(!password) throw Error('password is invalid!')

        const passwordHash = hashPassword(password)
        
        await knex('users').insert({ name, email, password: passwordHash })
            .then(response => {
                logMessage('info', 'User inserted', 'controller-users')
                res.status(201).json({ msg: 'User inserted' })
            })
            .catch(error => {
                throw Error(error.sqlMessage)
            })        
    } catch (error) {
        logMessage('error', error.message, 'controller-users')
        res.status(400).json({ error: error.message })
    }
}

const update = async (req, res) => {
    try {
        
        const id = req.params.id

        if(!id) throw Error('user id invalid!')

        const user = await knex('users').where({ id }).first()

        if(!user) throw Error('User not found')
        
        const { name, email, password } = req.body

        let passwordHash = user.password
        if(password){
            passwordHash = hashPassword(password)
        }

        let updateObject = {}

        if(name) updateObject = { name }
        if(password) updateObject = { ...updateObject, password: passwordHash }
        if(email) updateObject = { ...updateObject, email }

        await knex('users')
            .where({ id })
            .update(updateObject)
            .then(response => {
                logMessage('info', 'User updated', 'controller-users')
                res.status(204).json({ msg: 'User updated' })
            })
            .catch(error => {
                throw Error(error.sqlMessage)
            })        
    } catch (error) {
        logMessage('error', error.message, 'controller-users')
        res.status(400).json({ error: error.message })
    }
}

const get = async (req, res) => {
    try {        
        const id = req.params.id

        if(!id) throw Error('user id invalid!')

        const user = await knex('users').where({ id }).first()

        if(!user) throw Error('User not found')

        logMessage('info', 'User info', 'controller-users')
        res.status(200).json(user)       
    } catch (error) {
        logMessage('error', error.message, 'controller-users')
        res.status(400).json({ error: error.message })
    }
}

const getAll = async (req, res) => {
    try {
        await knex('users')
            .select('id', 'name', 'email', 'created_at')
            .then(response => {
                logMessage('info', 'User updated', 'controller-users')
                res.status(200).json({ users: response })
            })
            .catch(error => {
                throw Error(error.sqlMessage)
            })        
    } catch (error) {
        logMessage('error', error.message, 'controller-users')
        res.status(400).json({ error: error.message })
    }
}

const remove = async (req, res) => {
    try {        
        const id = req.params.id

        if(!id) throw Error('user id invalid!')

        const user = await knex('users').where({ id }).first()

        if(!user) throw Error('User not found')

        await knex('users')
            .where({ id })
            .del()
            .then(response => {
                logMessage('info', 'User deleted successfully', 'controller-users')
                res.status(200).json({ msg: 'User deleted successfully' })
            })
            .catch(error => {
                throw Error(error.sqlMessage)
            })
    } catch (error) {
        logMessage('error', error.message, 'controller-users')
        res.status(400).json({ error: error.message })
    }
}

const login = async (req, res) => {
    try {        
        const { email, password } = req.body

        if(!email) throw Error('email is invalid!')
        if(!password) throw Error('password is invalid!')

        const user = await knex('users').where({ email }).first()

        if(!user){
            logMessage('error', 'User not found', 'controller-users')
            res.status(404).json({ error: 'User not found' })
        }else{
            const match = await comparePassword(password, user.password);

            if(match) {
                const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.TOKEN_HASH, { expiresIn: 60 * 60 });
                res.status(200).json({ token: token });
            }else{
                logMessage('error', 'The password is incorrect.', 'controller-users')
                res.status(401).json({ error: 'The password is incorrect.' })
            }
        }
        
    } catch (error) {
        logMessage('error', error.message, 'controller-users')
        res.status(400).json({ error: error.message })
    }
}

module.exports = { insert, update, get, getAll, remove, login }