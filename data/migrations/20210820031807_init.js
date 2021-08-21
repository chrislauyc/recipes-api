
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
        .inTable("recipes");
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
        .inTable("ingredients");
        table.integer("step_id")
        .notNullable()
        .references("step_id")
        .inTable("steps");
        table.double("quantity")
        .notNullable()
        .unsigned();
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("recipes")
    .dropTableIfExists("steps")
    .dropTableIfExists("ingredients")
    .dropTableIfExists("ingredients_steps");
};
