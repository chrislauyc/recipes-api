
exports.seed = function(knex) {
  return knex('ingredients')
    .then(function () {
      // Inserts seed entries
      return knex('ingredients').insert([
        {ingredient_id: 1, name: 'macaroni'},
        {ingredient_id: 2, name: 'cheese'},
        {ingredient_id: 3, name: 'water'},
        {ingredient_id: 4, name: 'olive'},
      ]);
    });
};
