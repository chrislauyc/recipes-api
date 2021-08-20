
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('ingredients_steps').del()
    .then(function () {
      // Inserts seed entries
      return knex('ingredients_steps').insert([
        {id: 1, ingredient_id: 1, step_id:1, quantity:1},
        {id: 2, ingredient_id: 2, step_id:1, quantity:0.2},
        {id: 3, ingredient_id: 3, step_id:1, quantity:0.3},
        {id: 4, ingredient_id: 4, step_id:2, quantity:0.014},
      ]);
    });
};
