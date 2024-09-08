import mongoose from "mongoose";
import { Schema } from "mongoose";

export type Address = {
  city: String;
  state: String;
  zip: String;
};

const OrderSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  stepNo: {
    type: Number,
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
      },
      amount: {
        type: Number,
        required: true,
        default: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  billAddress: {
    city: {
      type: String
    },
    state: {
      type: String
    },
    zip: {
      type: String
    }
  },
  payment: {
    type: String,
    required: true
  },
  deliveryAddress: {
    city: {
      type: String
    },
    state: {
      type: String
    },
    zip: {
      type: String
    }
  },
  ffl: {
    type: String,
    required: true
  },
  date_added: {
    type: Date,
    default: Date.now
  },
  user_confirm: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Order", OrderSchema);
