
exports.seed = function(knex) {
  return knex('ingredients')
    .then(function () {
      // Inserts seed entries
      return knex('ingredients').insert([
        {ingredient_id: 1, ingredient_name: 'macaroni'},
        {ingredient_id: 2, ingredient_name: 'cheese'},
        {ingredient_id: 3, ingredient_name: 'water'},
        {ingredient_id: 4, ingredient_name: 'olive'},
      ]);
    });
};
