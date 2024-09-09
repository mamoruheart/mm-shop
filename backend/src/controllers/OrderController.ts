import { Request, Response } from "express";
import Order from "../model/order";

export const get_order = (req: Request, res: Response) => {
    console.log(req.params.id)
    if(req.params.id == 'undefined')
        Order.find().sort({date_added: -1}).then(orders => {res.status(200).json(orders)}).catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching orders' });
        });
    else
        Order.find().sort({date_added: -1}).then(orders => {res.status(200).json(orders.filter(item => String(item.user) === req.params.id))}).catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching orders' });
        });
}

export const post_order = (req:Request, res: Response) => {
    const newOrder = new Order(JSON.parse(req.body.order));
    const file = req.file as Express.Multer.File;
    newOrder.ffl = req.file?.filename!;
    console.log(newOrder);
    newOrder.save().then((order) => {res.json(order); console.log(order)})
}

export const update_order = (req:Request, res:Response) => {
    if(req.body.action == '1')
        Order.findByIdAndUpdate({_id: req.params.id},{$set:{stepNo: req.body.stepNo, user_confirm: false}}).then( order => {
            Order.find().sort({date_added: -1}).then(orders => res.json(orders));
        })
    else if(req.body.action == '0'){
        Order.findByIdAndUpdate({_id: req.params.id},{$set:{user_confirm: true}}).then( order => {
            Order.find().sort({date_added: -1}).then(orders => res.json(orders));
        })
    }
}

export const delete_order = (req:Request, res:Response) => {
    Order.findByIdAndDelete({_id: req.params.id}).then( order => {
        res.json({success:true});
    })
}