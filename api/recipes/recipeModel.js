const db = require("../../data/db-config");

const get=async({limit=10,page=0})=>{
    const recipes =  await db.select("*").from("recipes")
        .limit(limit)
        .offset(page);
    return recipes.map(recipe=>await getByName(recipe.name));
};
const getByName=async(name)=>{
    const recipe = await db.select("name","step_number","instructions").from("recipes")
    .leftJoin("steps","recipes.recipe_id","steps.recipe_id")
    .where({name}).first();
    return {
        name:recipe[0].name,
        steps:recipe.map(row=>({
            step_number:row.step_number,
            instructions:row.instructions,
            ingredients: await db.select("name","quantity").from("ingredients")
                .join("ingredients_steps","ingredients_steps.ingredient_id","ingredients.ingredient_id")
                .join("steps","ingredients_steps.step_id","steps.step_id")
        }))
    }
};
const insert=async(recipe)=>{
    const [recipe_id] = await db("recipe").insert(recipe.name);
    recipe.steps.forEach(step=>{
        const {step_number,instructions,ingredients} = step;
        const [step_id] = await db("steps").insert({step_number,recipe_id,instructions});
        ingredients.forEach(ingredient=>{
            const {name,quantity} = ingredient;
            let ingredient_id = await db("ingredients").where({name:ingredient.name}).first();
            if(!ingredient_id){
                ingredient_id = await db("ingredients").insert({step_id,name,quantity})[0];
            }
            await db("ingredients_steps").insert({step_id,ingredient_id,quantity});
        });
    })
};
const update=()=>{

};
const remove=()=>{

};
const getRecipes=()=>{

};

module.exports = {
    get,
    getByName,
    insert,
    update,
    remove,
    getRecipes
};