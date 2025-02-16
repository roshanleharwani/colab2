import mongoose, { Schema, type Document } from "mongoose"

export interface IJoinRequest extends Document {
  type: "project" | "startup" | "team"
  projectId?: mongoose.Types.ObjectId
  startupId?: mongoose.Types.ObjectId
  teamId?: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
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
      enum: ["project", "startup", "team"],
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: function (this: IJoinRequest) {
        return this.type === "project"
      },
    },
    startupId: {
      type: Schema.Types.ObjectId,
      ref: "Startup",
      required: function (this: IJoinRequest) {
        return this.type === "startup"
      },
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: function (this: IJoinRequest) {
        return this.type === "team"
      },
    },
    userId: {
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
      required: function (this: IJoinRequest) {
        return this.type === "project" || this.type === "startup"
      },
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

// Indexes
JoinRequestSchema.index({ userId: 1, status: 1 })
JoinRequestSchema.index({ projectId: 1, status: 1 })
JoinRequestSchema.index({ startupId: 1, status: 1 })
JoinRequestSchema.index({ teamId: 1, status: 1 })

// Compound index to prevent duplicate requests
JoinRequestSchema.index(
  {
    userId: 1,
    projectId: 1,
    startupId: 1,
    teamId: 1,
    status: 1,
  },
  {
    unique: true,
    partialFilterExpression: { status: "pending" },
  },
)

export const JoinRequest = mongoose.models.JoinRequest || mongoose.model<IJoinRequest>("JoinRequest", JoinRequestSchema)

