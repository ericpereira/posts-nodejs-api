# Node JS API for a Post control system
The user here can create an account, create a post and like or unlike your own posts or the posts of the other users. The users can comment one post as well and the owner of the post or the owner of the comment can remove this comments. Click in the link bellow to access the API docs.
[API docs](https://elements.getpostman.com/redirect?entityId=4732214-cb5f7041-0626-4ca1-b1ee-e71f1bc4fbcd&entityType=collection)
## Technologies
- Express [open](http://expressjs.com/)
- Knex [open](https://knexjs.org/)
- JWT [open](https://github.com/auth0/node-jsonwebtoken)
- Mysql

## Installation

This project requires [Node.js](https://nodejs.org/) v18+ to run and a database created in mysql 8 to manage the data. We need the [Knex CLI](https://knexjs.org/) installed to run the migrations.

Install the dependencies.

```sh
cd posts-nodejs-api
```

```sh
npm install
```

```sh
cp .env.example .env
```
Fill the dotenv created with your database credentials

```sh
knex migrate:latest
```
```sh
nodemon src/server.js
```

## How to use

- Open the link http://localhost:5555 in the browser to start to use the API
