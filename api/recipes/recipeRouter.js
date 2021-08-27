const router = require("express").Router();
const recipeModel = require("./recipeModel");

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
router.post("/",async(req,res,next)=>{
    try{
        res.status(201).json(await recipeModel.insert(req.body));
    }
    catch(err){
        next(err);
    }
});
router.put("/:id",(req,res,next)=>{
    try{
        res.status(200).json({message:"not implemented yet"})
    }
    catch(err){
        next(err);
    }
});
router.delete("/:id",(req,res,next)=>{
    try{
        res.status(200).json(await recipeModel.remove(req.recipe_id));
    }
    catch(err){
        next(err);
    }
});
router.get("/:id/ingredients",(req,res,next)=>{
    try{
        res.status(200).json(await recipeModel.getIngredients(req.recipe_id));
    }
    catch(err){
        next(err);
    }
});


module.exports = router;