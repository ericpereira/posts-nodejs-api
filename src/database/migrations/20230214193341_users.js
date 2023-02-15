/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('users', function (table) {
        table.increments('id');
        table.string('name', 255).notNullable();
        table.string('email', 255).unique().notNullable();
        table.string('password', 255);
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
