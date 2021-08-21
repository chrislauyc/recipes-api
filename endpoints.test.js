const request = require('supertest')
const server = require('./api/server')
const db = require('./data/db-config')
const { recipes } = require('./data/seeds/001-recipes')

const data = {
  "recipe_id" : 2,
  "name": "Spaghetti Bolognese",
  "created_at": "2021-01-01 08:23:19.120",
  "steps": [
    {
      "step_id": 5,
      "step_number": 1,
      "instructions": "Put a large saucepan on a medium heat",
      "ingredients": []
    },
    {
      "step_id": 6,
      "step_number": 2,
      "instructions": "Add 1 tbsp olive oil",
      "ingredients": [
        { "ingredient_id": 4, "name": "olive oil", "quantity": 0.014 }
      ]
    },
  ]
}
/**
[GET] /api/recipes
[GET] /api/recipes/:id
[POST] /api/recipes
[PUT] /api/recipes/:id
[DELETE] /api/recipes/:id
[GET] /api/recipes/:id/ingredients
 */

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

test('[0] sanity check', () => {
  expect(true).not.toBe(false)
})
describe('server.js', () => {
  describe('[GET] /api/recipes', () => {
    test('[1] can get the correct number of recipes', async () => {
      let res = await request(server).get('/api/recipes')
      expect(res.body).toHaveLength(recipes.length)
    }, 750)
    test('[2] gets the empty array if there are no recipes', async () => {
      await db('recipes').truncate()
      let res = await request(server).get('/api/recipes')
      expect(res.body).toHaveLength(0)
    }, 750)
  })
  describe('[GET] /api/recipes/:id', () => {
    test('[3] can get the correct recipe', async () => {
      let res = await request(server).get('/api/recipes/1')
      expect(res.body).toMatchObject(recipes[0])
      res = await request(server).get('/api/recipes/2')
      expect(res.body).toMatchObject(recipes[1])
    }, 750)
    test('[4] responds with a 404 if the id does not exist', async () => {
      let res = await request(server).get('/api/recipes/111')
      expect(res.status).toBe(404)
    }, 750)
    test('[5] responds with "recipe not found" if the id does not exist', async () => {
      let res = await request(server).get('/api/recipes/111')
      expect(res.body.message).toMatch(/recipe not found/i)
    }, 750)
  })
  describe('[POST] /api/recipes', () => {
    test('[6] creates a new recipe in the database', async () => {
      await request(server).post('/api/recipes').send({ 
        name: 'foo', steps: [
          {
            step_number:1,
            ingredients:[
              {
                "name": "olive oil",
                "quantity": 0.014
              }
            ],
            instructions:"put them together and then cook them"
          }

      ]})
      let recipe = await db('recipe');
      expect(recipe).toHaveLength(recipe.length + 1);
      const res = await request(server).get(`/api/recipes/${recipe.length}`);
      expect(res.body).toMatchObject(
        { 
          name: 'foo', steps: [
            {
              step_number:1,
              ingredients:[
                {
                  "name": "olive oil",
                  "quantity": 0.014
                }
              ],
              instructions:"put them together and then cook them"
            }
        ]}
      );
    }, 750)
    test('[7] responds with a 201 and the newly created recipe', async () => {
      const res = await request(server).post('/api/recipes').send({ 
        name: 'foo', steps: [
          {
            step_number:1,
            ingredients:[
              {
                "name": "olive oil",
                "quantity": 0.014
              }
            ],
            instructions:"put them together and then cook them"
          }

      ]})
      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({ 
        name: 'foo', steps: [
          {
            step_number:1,
            ingredients:[
              {
                "name": "olive oil",
                "quantity": 0.014
              }
            ],
            instructions:"put them together and then cook them"
          }

      ]})
    }, 750)
    test('[8] trims the leading and trailing whitespace in the name of the new recipe', async () => {
      const res = await request(server).post('/api/recipes').send({ 
        name: '   foo    ', steps:[{
          step_number:1,
          ingredients:[],
          instructions:"put them together and then cook them"
        }]
      })
      expect(res.body).toMatchObject({ 
        name: 'foo', steps: [{
          step_number:1,
          ingredients:[],
          instructions:"put them together and then cook them"
        }]
      })
    }, 750)
    test('[9] responds with a 400 and proper error if name or steps are undefined', async () => {
      const invalid1 = {}
      const invalid2 = { name: "foo" }
      const invalid3 = { steps: [] }

      let res = await request(server).post('/api/recipes').send(invalid1)
      expect(res.body.message).toMatch(/name and steps are required/i)
      expect(res.status).toBe(400)
      res = await request(server).post('/api/recipes').send(invalid2)
      expect(res.body.message).toMatch(/name and steps are required/i)
      expect(res.status).toBe(400)
      res = await request(server).post('/api/recipes').send(invalid3)
      expect(res.body.message).toMatch(/name and steps are required/i)
      expect(res.status).toBe(400)
    }, 750)
    test('[10] responds with a 400 and proper error if name is not a string', async () => {
      const invalid = { name: 123, steps: [{
        step_number:1,
        ingredients:[],
        instructions:"put them together and then cook them"
      }]}
      let res = await request(server).post('/api/recipes').send(invalid)
      expect(res.body.message).toMatch(/must be a string/i)
      expect(res.status).toBe(400)
    }, 750)
    test('[11] responds with a 400 and proper error if name is too short or too big (after trimming)', async () => {
      const invalid1 = { name: "fo", steps: [{
        step_number:1,
        ingredients:[],
        instructions:"put them together and then cook them"
      }] }
      const invalid2 = { name: "  fo   ", steps: [{
        step_number:1,
        ingredients:[],
        instructions:"put them together and then cook them"
      }] }
      const invalid3 = { name: "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901", steps: [{
        step_number:1,
        ingredients:[],
        instructions:"put them together and then cook them"
      }] }
      let res = await request(server).post('/api/recipes').send(invalid1)
      expect(res.body.message).toMatch(/between 3 and 100/i)
      expect(res.status).toBe(400)
      res = await request(server).post('/api/recipes').send(invalid2)
      expect(res.body.message).toMatch(/between 3 and 100/i)
      expect(res.status).toBe(400)
      res = await request(server).post('/api/recipes').send(invalid3)
      expect(res.body.message).toMatch(/between 3 and 100/i)
      expect(res.status).toBe(400)
    }, 750)
    test('[12] responds with a 400 and proper error if steps is empty or not an array', async () => {
      const invalid1 = { name: "foo", steps: NaN }
      const invalid2 = { name: "foo", steps: [] }
      let res = await request(server).post('/api/recipes').send(invalid1)
      expect(res.body.message).toMatch(/must be a number/i)
      expect(res.status).toBe(400)
      res = await request(server).post('/api/recipes').send(invalid2)
      expect(res.body.message).toMatch(/must be a number/i)
      expect(res.status).toBe(400)
    }, 750)
    // test('[13]', async () => {
    //   const invalid1 = { name: "foo", budget: -1 }
    //   const invalid2 = { name: "foo", budget: 1000001 }
    //   let res = await request(server).post('/api/recipes').send(invalid1)
    //   expect(res.body.message).toMatch(/too large or too small/i)
    //   expect(res.status).toBe(400)
    //   res = await request(server).post('/api/recipes').send(invalid2)
    //   expect(res.body.message).toMatch(/too large or too small/i)
    //   expect(res.status).toBe(400)
    // }, 750)
    test('[14] responds with a 400 and proper error if name already exists in the db', async () => {
      let res = await request(server).post('/api/recipes').send(recipes[0])
      expect(res.body.message).toMatch(/name is taken/i)
      expect(res.status).toBe(400)
    }, 750)
  })
  describe('[PUT] /api/recipes/:id', () => {
    test('[15] updates the account in the database', async () => {
      await request(server).put('/api/recipes/1').send({ 
        name: 'foo', steps: [
          {
            step_number:1,
            ingredients:[
              {
                "name": "vegetable oil",
                "quantity": 0.014
              }
            ],
            instructions:"put them together and then cook them"
          }

      ]})
      let recipe = await request(server).get("/api/recipes/1")
      expect(recipe).toMatchObject({ name: 'foo', steps: [
        {
          step_number:1,
          ingredients:[
            {
              "name": "vegetable oil",
              "quantity": 0.014
            }
          ],
          instructions:"put them together and then cook them"
        }

    ] })
    }, 750)
    test('[16] responds with a 200 and the newly updated recipe', async () => {
      const res = await request(server).put('/api/recipes/1').send({ 
        name: 'foo', steps: [
          {
            step_number:1,
            ingredients:[
              {
                "name": "vegetable oil",
                "quantity": 0.014
              }
            ],
            instructions:"put them together and then cook them"
          }

      ]})
      expect(res.body).toMatchObject({ 
        name: 'foo', steps: [
          {
            step_number:1,
            ingredients:[
              {
                "name": "vegetable oil",
                "quantity": 0.014
              }
            ],
            instructions:"put them together and then cook them"
          }
      ]})
      expect(res.status).toBe(200)
    }, 750)
    test('[17] responds with a 404 if the id does not exist', async () => {
      let res = await request(server).put('/api/recipes/111').send({ name: 'foo', budget: 1000 })
      expect(res.status).toBe(404)
    }, 750)
    test('[18] responds with a 400 and proper error if name or budget are undefined', async () => {
      const invalid1 = {}
      const invalid2 = { name: "foo" }
      const invalid3 = { steps: [{
        step_number:1,
        ingredients:[
          {
            "name": "vegetable oil",
            "quantity": 0.014
          }
        ],
        instructions:"put them together and then cook them"
      }] }
      let res = await request(server).put('/api/recipes/1').send(invalid1)
      expect(res.body.message).toMatch(/name and steps are required/i)
      expect(res.status).toBe(400)
      res = await request(server).put('/api/recipes/1').send(invalid2)
      expect(res.body.message).toMatch(/name and steps are required/i)
      expect(res.status).toBe(400)
      res = await request(server).put('/api/recipes/1').send(invalid3)
      expect(res.body.message).toMatch(/name and steps are required/i)
      expect(res.status).toBe(400)
    }, 750)
    test('[19] responds with a 400 and proper error if name is not a string', async () => {
      const invalid = { name: 123, steps: [{
        step_number:1,
        ingredients:[],
        instructions:"put them together and then cook them"
      }]}
      let res = await request(server).put('/api/recipes/1').send(invalid)
      expect(res.body.message).toMatch(/must be a string/i)
      expect(res.status).toBe(400)
    }, 750)
    test('[20] responds with a 400 and proper error if name is too short or too big (after trimming)', async () => {
      const invalid1 = { name: "fo", steps: [{
        step_number:1,
        ingredients:[],
        instructions:"put them together and then cook them"
      }] }
      const invalid2 = { name: "  fo   ", steps: [{
        step_number:1,
        ingredients:[],
        instructions:"put them together and then cook them"
      }] }
      const invalid3 = { name: "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901", steps: [{
        step_number:1,
        ingredients:[],
        instructions:"put them together and then cook them"
      }] }
      let res = await request(server).put('/api/recipes/1').send(invalid1)
      expect(res.body.message).toMatch(/between 3 and 100/i)
      expect(res.status).toBe(400)
      res = await request(server).put('/api/recipes/1').send(invalid2)
      expect(res.body.message).toMatch(/between 3 and 100/i)
      expect(res.status).toBe(400)
      res = await request(server).put('/api/recipes/1').send(invalid3)
      expect(res.body.message).toMatch(/between 3 and 100/i)
      expect(res.status).toBe(400)
    }, 750)
    test('[21] responds with a 400 and proper error if step is not an array or if the array is empty', async () => {
      const invalid1 = { name: "foo", steps: NaN }
      const invalid2 = { name: "foo", steps: [] }
      let res = await request(server).put('/api/recipes/1').send(invalid1)
      expect(res.body.message).toMatch(/must be an array/i)
      expect(res.status).toBe(400)
      res = await request(server).put('/api/recipes/1').send(invalid2)
      expect(res.body.message).toMatch(/a recipe must have at least one step/i)
      expect(res.status).toBe(400)
    }, 750)
    // test('[22] responds with a 400 and proper error if budget is negative or too big', async () => {
    //   const invalid1 = { name: "foo", budget: -1 }
    //   const invalid2 = { name: "foo", budget: 1000001 }
    //   let res = await request(server).put('/api/recipes/1').send(invalid1)
    //   expect(res.body.message).toMatch(/too large or too small/i)
    //   expect(res.status).toBe(400)
    //   res = await request(server).put('/api/recipes/1').send(invalid2)
    //   expect(res.body.message).toMatch(/too large or too small/i)
    //   expect(res.status).toBe(400)
    // }, 750)
  })
  describe('[DELETE] /api/recipes/:id', () => {
    test('[23] can delete the correct recipe', async () => {
      await request(server).delete('/api/recipes/1')
      const recipe = await db('recipes').where('id', 1).first()
      expect(recipe).not.toBeDefined()
    }, 750)
    test('[24] responds with a 404 if the id does not exist', async () => {
      let res = await request(server).delete('/api/recipes/111')
      expect(res.status).toBe(404)
    }, 750)
    test('[25] responds with "recipe not found" if the id does not exist', async () => {
      let res = await request(server).delete('/api/recipes/111')
      expect(res.body.message).toMatch(/recipe not found/i)
    }, 750)
  })
})
