/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('comments', function (table) {
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
        table.text('description')
        table.integer('deleted_by')
            .unsigned()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table.datetime('deleted_at')
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
        table.datetime('updated_at')
    })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
