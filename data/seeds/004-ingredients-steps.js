
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('ingredients_steps').del()
    .then(function () {
      // Inserts seed entries
      return knex('ingredients_steps').insert([
        {id: 1, ingredient_id: 1, step_id:1, quantity:"1 tablespoon"},
        {id: 2, ingredient_id: 2, step_id:1, quantity:"2 grams"},
        {id: 3, ingredient_id: 3, step_id:1, quantity:"1 hand full"}
      ]);
    });
};
