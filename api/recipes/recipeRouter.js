const router = require("express").Router();

/*
    [GET] /api/recipes
    [GET] /api/recipes/:id
    [POST] /api/recipes
    [PUT] /api/recipes/:id
    [DELETE] /api/recipes/:id
    [GET] /api/recipes/:id/ingredients
*/
router.get("/",(req,res,next)=>{
    try{

    }
    catch(err){
        next(err);
    }
});
router.get("/:id",(req,res,next)=>{
    try{

    }
    catch(err){
        next(err);
    }
});
router.post("/",(req,res,next)=>{
    try{
        
    }
    catch(err){
        next(err);
    }
});
router.put("/:id",(req,res,next)=>{
    try{

    }
    catch(err){
        next(err);
    }
});
router.delete("/:id",(req,res,next)=>{
    try{

    }
    catch(err){
        next(err);
    }
});
router.get("/:id/ingredients",(req,res,next)=>{
    try{

    }
    catch(err){
        next(err);
    }
});


module.exports = router;