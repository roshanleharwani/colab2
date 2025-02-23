import mongoose, { Schema, type Document } from "mongoose"

export interface IJoinRequest extends Document {
  type: "project" | "startup" | "team"
  projectId?: mongoose.Types.ObjectId
  startupId?: mongoose.Types.ObjectId
  teamId?: mongoose.Types.ObjectId
  FromUserId: mongoose.Types.ObjectId
  ToUserId: mongoose.Types.ObjectId
  message: string
  role?: string
  status: "pending" | "accepted" | "rejected"
  createdAt: Date
  updatedAt: Date
}

const JoinRequestSchema = new Schema(
  {
    type: {
      type: String,
      required: [true, "Request type is required"],
      default:"project",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required:true
    },
    FromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    ToUserId:{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: [10, "Message must be at least 10 characters"],
    },
    role: {
      type: String,
      required: [true, "Role is required"]
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
)



export const JoinRequest = mongoose.models.JoinRequest || mongoose.model<IJoinRequest>("JoinRequest", JoinRequestSchema)

