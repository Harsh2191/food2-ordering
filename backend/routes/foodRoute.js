import express, { request, response } from "express"
import {auth} from "../middleware/authMiddleware.js"
import {Food} from "../models/foodModel.js"

const router= express.Router();

// creating new item

router.post('/',auth,async(request,response)=>{
  try{
    if(
      !request.body.name || !request.body. priceInCents || !request.body.image){
        return response.status(400).send({message:"required fields are missing"})
      }
      const newFood = {
        name: request.body.name,
        priceInCents: request.body.priceInCents,
        image: request.body.image
      };
      const food= await Food.create(newFood);

      return response.status(201).send(food);
    
  }
  catch (error) {
    console.log(error.message);
    response.status(500).send({message:error.message});
  }
});

//getting all item
router.get('/', async(request,response)=>{

  try{
const food=await Food.find({});
return response.status(200).json({
  data:food
})
  }
  catch (error){
    console.log(error.message);
    response.status(5000).send({message:error.message});
  }

})

//deleting all item
router.delete("/:id",auth,async(request,response)=>{
  try{
    const {id} = request.params;
    const result = await Food.findByIdAndDelete(id);
    if(!result){
      response.status(404).json({message: "item not found"});
    }
    response.status(200).json({message:"Item successfully Created",deletedItem: result})
  }
  catch (error){
    console.log(error.message);
    response.status(5000).send({message:error.message});
  }
})

// updating a food item
router.put('/:id',auth,async(request,response)=>{
  try{
    if(
      !request.body.name || !request.body. priceInCents ){
        return response.status(400).send({message:"required fields are missing"})
      }
      const {id}=request.params;
      const result = await Food.findByIdAndUpdate(id,request.body,{
        new: true
      });
      if(!result){
        response.status(404).send({message: "item not found"});
      }
      return response.status(200).send({message:"food updated"});

  }
  catch (error){
    console.log(error.message);
    response.status(5000).send({message:error.message});
  }
})

//getting specific food item
router.get("/:id",async(request,response)=>{
  try{
    const {id}=request.params;
    const food = await Food.findById(id);
    response.status(200).json(food);
  }
  catch (error){
    console.log(error.message);
    response.status(5000).send({message:error.message});
  }
})

export default router;