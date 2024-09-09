import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const ProductSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category:{
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    date_added: {
        type: Date,
        default: Date.now
    },
    caliber: {
        type: Number,
    },
    actionType: {
        type: String,
        enum: ['Bolt-Action' , 'Lever-action' , 'Semi-Automatic' , 'Automatic' , 'Pump-Action' , 'Break-Action' , 'None' , 'Extra'],
        required: true
    },
    barrelLength: {
        type: Number,
    },
    overAllLength: {
    },
    weight: {
        type: Number,
    },
    magazineCapacity: {
        type: Number,
    },
    stockType: {
        type: String,
    },
    images: {
        type: [String],
    }
})

export default mongoose.model('Product', ProductSchema); 