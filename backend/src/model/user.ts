import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    isLowercase: true
  },
  phone: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: [true, "Please enter a valid password"],
    minLength: [6, "Minium password length must be 6 chracters"]
  },
  state: {
    type: Number,
    required: true
  },
  register_date: {
    type: Date,
    default: Date.now
  },
  googleId: {
    type: String
  }
});

export default mongoose.model("User", UserSchema);
