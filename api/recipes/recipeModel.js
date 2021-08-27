const db = require("../../data/db-config");

const get=async({recipe_id,recipe_name,limit=10,page=0})=>{
    const query = {};
    if(recipe_id){
        query.recipe_id = recipe_id;
    }
    if(recipe_name){
        query.recipe_name = recipe_name;
    }
    return db.select("*").from("recipes")
        .where(query)
        .limit(limit)
        .offset(page);
};
const getWholeRecipe=async(recipe_id)=>{
    const recipe = await db.select("recipe_name","step_number","instructions").from("recipes")
    .leftJoin("steps","recipes.recipe_id","steps.recipe_id")
    .where({recipe_id}).first();
    return {
        name:recipe[0].name,
        steps:recipe.map(row=>({
            step_number:row.step_number,
            instructions:row.instructions,
            ingredients: await db.select("ingredients_name","quantity").from("ingredients")
                .join("ingredients_steps","ingredients_steps.ingredient_id","ingredients.ingredient_id")
                .join("steps","ingredients_steps.step_id","steps.step_id")
        }))
    }
};
const insert=async(recipe)=>{
    const [recipe_id] = await db("recipes").insert(recipe.recipe_name);
    recipe.steps.forEach(step=>{
        const {step_number,instructions,ingredients} = step;
        const [step_id] = await db("steps").insert({step_number,recipe_id,instructions});
        ingredients.forEach(ingredient=>{
            const {ingredient_name,quantity} = ingredient;
            let ingredient_id = await db("ingredients").where({ingredient_name}).first();
            if(!ingredient_id){
                ingredient_id = await db("ingredients").insert({step_id,ingredient_name,quantity})[0];
            }
            await db("ingredients_steps").insert({step_id,ingredient_id,quantity});
        });
    });
    return getWholeRecipe(recipe_id);
};

const remove=(recipe_id)=>{
    return db("recipes").where({recipe_id}).del(["recipe_id","recipe_name"]);
    // 
    // await db("ingredients").whereIn(db())
    // // get records of ingredients_steps.ids and ingredient_id and delete
    // const ingSteps = await db("ingredients_steps").whereIn(db("steps").where({"steps.step_id":"ingredients_steps.step_id",recipe_id})).del(["ingredient_id","ingredients_steps.id"]);
    // // delete steps
    // await db("steps").where({recipe_id}).del();
    // // delete ingredients
    // await db("ingredients").where({recip})
};
const getIngredients=(recipe_id)=>{
    return db("recipes")
    .join("steps","steps.recipe_id","recipes.recipe_id")
    .join("ingredients_steps","ingredients_steps.step_id","steps.step_id")
    .join("ingredients", "ingredients.ingredient_id","ingredients_steps.ingredient_id")
    .where("",recipe_id)
    .select("ingredients.ingredient_id as ingredient_id","ingredients.name as name");
};

module.exports = {
    get,
    getWholeRecipe,
    insert,
    remove,
    getIngredients
};