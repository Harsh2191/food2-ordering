import express from "express"

import Order from "../models/orderModel.js"
import Stripe from "stripe"
import { config } from "dotenv"

config();
const router = express.Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//handle stripe webhook events

router.post('/webhooks' ,express.raw({type:'application/json'}), async(req,res)=>{

  const signature = req.headers['stripe-signature'];

  let event;
  try{
    event = stripe.webhooks.constructEvent(req.body ,signature, process.env.STRIPE_WEBHOOK_SECRET);

  } catch (error){
      console.log('webhook error' , error,message);
      return res.status(400).send('webhook error: ${error.message}')
  }
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;

  const items = JSON.parse(session.metadata.productDetails);

  const order = new Order({
    customerEmail: session.customer_details.email,
    items:items,
    address:{
      line1: session.customer_details.address.line1,
        line2: session.customer_details.address.line2,
        city: session.customer_details.address.city,
        state: session.customer_details.address.city,
        postal_code: session.customer_details.address.postal_code,
        country: session.customer_details.address.country
    }

  })
  try{
    await order.save();
    console.log('order saved succesfully')
  } catch(error){
    console.error('error saving order', error)
  }
}
res.json({received: true})

})

export {router as webhookRouter};

