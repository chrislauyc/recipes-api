const router = require("express").Router();
const recipeModel = require("./recipeModel");
const {
    checkValidRecipe,
    recipe_nameCannotExist,
    recipe_idMustExist
} = require("./recipeMiddleware");

/*
    [GET] /api/recipes
    [GET] /api/recipes/:id
    [POST] /api/recipes
    [PUT] /api/recipes/:id
    [DELETE] /api/recipes/:id
    [GET] /api/recipes/:id/ingredients
*/
router.get("/",async(req,res,next)=>{
    try{
        res.status(200).json(await recipeModel.get(req.query));
    }
    catch(err){
        next(err);
    }
});
router.post("/",checkValidRecipe,recipe_nameCannotExist,async(req,res,next)=>{
    try{
        res.status(201).json(await recipeModel.insert(req.body));
    }
    catch(err){
        next(err);
    }
});
router.get("/:recipe_id",recipe_idMustExist,async(req,res,next)=>{
    try{
        res.status(200).json(await recipeModel.getWholeRecipe(req.params.recipe_id));
    }
    catch(err){
        next(err);
    }
});
router.put("/:recipe_id",(req,res,next)=>{
    try{
        res.status(200).json({message:"not implemented yet"})
    }
    catch(err){
        next(err);
    }
});
router.delete("/:recipe_id",recipe_idMustExist,async(req,res,next)=>{
    try{
        res.status(200).json(await recipeModel.remove(req.params.recipe_id));
    }
    catch(err){
        next(err);
    }
});
router.get("/:recipe_id/ingredients",async(req,res,next)=>{
    try{
        res.status(200).json(await recipeModel.getIngredients(req.params.recipe_id));
    }
    catch(err){
        next(err);
    }
});


module.exports = router;