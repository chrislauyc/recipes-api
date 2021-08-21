
exports.up = function(knex) {
    return knex.schema.createTable("recipes",table=>{
        table.increments("recipe_id");
        table.string("name").notNullable().unique();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable("steps",table=>{
        table.increments("step_id");
        table.integer("step_number")
        .unsigned()
        .notNullable();
        table.integer("recipe_id")
        .notNullable()
        .references("recipe_id")
        .inTable("recipes")
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
        table.string("instructions")
        .notNullable();
    })
    .createTable("ingredients",table=>{
        table.increments("ingredient_id");
        table.string("name").notNullable().unique();
    })
    .createTable("ingredients_steps",table=>{
        table.increments("id");
        table.integer("ingredient_id")
        .notNullable()
        .references("ingredient_id")
        .inTable("ingredients")
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
        table.integer("step_id")
        .notNullable()
        .references("step_id")
        .inTable("steps")
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
        table.double("quantity")
        .notNullable()
        .unsigned();
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("ingredients_steps")
    .dropTableIfExists("ingredients")
    .dropTableIfExists("steps")
    .dropTableIfExists("recipes")
};
