import { Request, Response } from "express";
import Customer from "../model/user";

export const get_customer = (req: Request, res: Response) => {
    Customer.find().sort({date_added: -1}).then(customers => res.json(customers));
}

export const post_customer = (req:Request, res: Response) => {
    console.log('aaaaaaaaaasdfsadf');
    
    const newData = req.body;
    const newCustomer = new Customer(newData);
    console.log(newCustomer);
    console.log(req.body);
    newCustomer.save();
    get_customer(req, res);
} 

export const update_customer = (req:Request, res:Response) => { 
    const newData = req.body; 
    Customer.findByIdAndUpdate({_id: req.params.id}, {$set: {state:  newData.state}}).then( customer => {
        Customer.findOne({_id: req.params.id}).then( customer => {
            get_customer(req, res);
        })
    })
}

export const delete_customer = (req:Request, res:Response) => {
    Customer.findByIdAndDelete({_id: req.params.id}).then( customer => {
        get_customer(req, res);
    })
}