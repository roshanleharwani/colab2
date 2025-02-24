import mongoose from 'mongoose';



const UserSchema   = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number, 
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  registration_number: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  reset_token: {
    type: String,
    required: false,
  },
});
export const User = mongoose.models.User || mongoose.model("User", UserSchema)

