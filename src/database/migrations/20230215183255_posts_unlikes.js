/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('posts_unlikes', function (table) {
        table.increments('id')
        table.integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table.integer('post_id')
            .unsigned()
            .references('id')
            .inTable('posts')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('posts_unlikes')
};
