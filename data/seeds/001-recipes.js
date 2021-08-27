
exports.seed = function(knex) {
  return knex('recipes')
    .then(function () {
      // Inserts seed entries
      return knex('recipes').insert([
        {recipe_id: 1, recipe_name: 'mac n cheese',created_at:"2021-01-01 08:23:19.120"},
        {recipe_id: 2, recipe_name: 'Spaghetti Bolognese',created_at:"2021-01-02 08:23:19.120"},
        {recipe_id: 3, recipe_name: 'tomatoe soap',created_at:"2021-01-03 08:23:19.120"}
      ]);
    });
};
