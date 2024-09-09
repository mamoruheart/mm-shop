import { Request, Response } from "express";
import Product from "../model/product";

const parseRequest = (req: Request) => {
    const newData = {
        category: req.body.category,
        description: String(req.body.description),
        price: +req.body.price,
        title: String(req.body.name),
        actionType: req.body.actionType ?? 'None',
        barrelLength: +req.body.barrelLength ?? 0,
        caliber: +req.body.caliber ?? 0,
        magazineCapacity: +req.body.magazineCapacity ?? 0,
        overAllLength: +req.body.overAllLength ?? 0,
        stockType: String(req.body.stockType) ?? '',
        weight: +req.body.weight ?? 0,
        images: req.body.images ? req.body.images.split('|') : []
      }

    const files = req.files as Express.Multer.File[];
    console.log(files)
    if(!!files)
        if(files.length != 0){
            const fileUrls = files.map(file => ({ 
                filename: file.filename,
                url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            }));
            newData.images = [];
            fileUrls.map((fileUrl) => {
                newData.images.push(fileUrl.filename);
            })
        }
    return newData;
}

export const get_product = (req: Request, res: Response) => {
    Product.find().populate('category').sort({date_added: -1}).then(products => res.json(products));
}

export const post_product = (req:Request, res: Response) => {
    console.log('aaaaaaaaaasdfsadf');
    
    const newData = parseRequest(req);
    const newProduct = new Product(newData);
    console.log(newProduct);
    console.log(req.body);
    newProduct.save();
    get_product(req, res);
} 

export const update_product = (req:Request, res:Response) => { 
    const newData = parseRequest(req); 
    Product.findByIdAndUpdate({_id: req.params.id}, newData).then( product => {
        Product.findOne({_id: req.params.id}).then( product => {
            get_product(req, res);
    })
    })
}

export const delete_product = (req:Request, res:Response) => {
    console.log('delete', req.body);
    Product.findByIdAndDelete({_id: req.params.id}).then( product => {
        get_product(req, res);
    })
}