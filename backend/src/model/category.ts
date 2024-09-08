import mongoose from "mongoose";
import { Schema } from "mongoose";

const CategorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  }
});

export default mongoose.model("Category", CategorySchema);
