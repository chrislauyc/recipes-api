const recipeModel = require("./recipeModel");
const checkValidRecipe=(req,res,next)=>{
    try{
        const {recipe_name,steps} = req.body;
        if(recipe_name === undefined || typeof(recipe_name) !== "string"){
            return res.status(400).json({message:`invalid recipe_name: ${recipe_name}`});
        }
        if(steps === undefined || !Array.isArray(steps)){
            return res.status(400).json({message:"invalid steps"});
        }
        req.body.recipe_name = recipe_name.trim();
        steps.forEach(step=>{
            const {step_number,instructions,ingredients} = step;
            if(step_number === undefined || typeof(step_number) !== "number"){
                return res.status(400).json({message:"invalid number"});
            }
            if(instructions === undefined || typeof(instructions) !== "string"){
                return res.status(400).json({message:"invalid instructions"});
            }
            if(ingredients === undefined || !Array.isArray(ingredients)){
                return res.status(400).json({message:"invalid ingredients"});
            }
            req.body.instructions = instructions.trim();
            ingredients.forEach(ing=>{
                const {ingredient_name,quantity} = ing;
                if(ingredient_name === undefined || typeof(ingredient_name) !== "string"){
                    return res.status(400).json({message:"invalid ingredient_name"});
                }
                if(quantity === undefined || typeof(quantity) !== "number"){
                    return res.status(400).json({message:"invalid quantity"});
                }
                req.ingredient_name = ingredient_name.trim();
            });
        });
        next();
    }
    catch(err){
        next(err);
    }
};
const recipe_nameCannotExist=async(req,res,next)=>{
    try{
        const recipes = await recipeModel.get({recipe_name:req.body.recipe_name});
        if(recipes.length !== 0){
            return res.status(400).json({message:"recipe_name already exists"});
        }
        next();
    }
    catch(err){
        next(err);
    }
};
const recipe_idMustExist=async(req,res,next)=>{
    try{
        const recipes = await recipeModel.get({recipe_id:req.params.recipe_id});
        if(recipes.length !== 1){
            return res.status(404).json({message:"recipe not found"});
        }
        next();
    }
    catch(err){
        next(err);
    }
};
module.exports = {
    checkValidRecipe,
    recipe_nameCannotExist,
    recipe_idMustExist
};