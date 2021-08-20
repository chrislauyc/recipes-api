
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('recipes').del()
    .then(function () {
      // Inserts seed entries
      return knex('recipes').insert([
        {recipe_id: 1, name: 'mac n cheese'},
        {recipe_id: 2, name: 'hamburger'},
        {recipe_id: 3, name: 'tomatoe soap'}
      ]);
    });
};
