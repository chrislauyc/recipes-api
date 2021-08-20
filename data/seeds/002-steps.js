
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('steps').del()
    .then(function () {
      // Inserts seed entries
      return knex('steps').insert([
        {step_id: 1, step_number: 1, recipe_id: 1, instructions:"put everything together"},
        {step_id: 2, step_number: 2, recipe_id: 1, instructions:"cook it a little"},
        {step_id: 3, step_number: 3, recipe_id: 1, instructions:"simmer a little"},
        {step_id: 4, step_number: 4, recipe_id: 1, instructions:"plate up"},
      ]);
    });
};
