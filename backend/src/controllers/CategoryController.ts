import { Request, Response } from "express";
import Category from "../model/category";

export const get_category = (req: Request, res: Response) => {
    Category.find().then(category => res.json(category));
}

export const post_category = (req:Request, res: Response) => {
    const newCategory = new Category(req.body);
    newCategory.save().then(category => res.json(category));
}

export const update_category = (req:Request, res:Response) => {
    Category.findByIdAndUpdate({_id: req.params.id}, req.body).then( category => {
        Category.findOne({_id: req.params.id}).then( category => {
            res.json(category);
        })
    })
}

export const delete_category = (req:Request, res:Response) => {
    Category.findByIdAndDelete({_id: req.params.id}).then( category => {
        res.json({success:true});
    })
}