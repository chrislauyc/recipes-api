
exports.seed = function(knex) {
  return knex('ingredients_steps')
    .then(function () {
      // Inserts seed entries
      return knex('ingredients_steps').insert([
        {ingredients_steps_id: 1, ingredient_id: 1, step_id:1, quantity:1},
        {ingredients_steps_id: 2, ingredient_id: 2, step_id:1, quantity:0.2},
        {ingredients_steps_id: 3, ingredient_id: 3, step_id:1, quantity:0.3},
        {ingredients_steps_id: 4, ingredient_id: 4, step_id:2, quantity:0.014},
      ]);
    });
};
