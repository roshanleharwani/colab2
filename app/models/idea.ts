import mongoose, { Schema, type Document } from "mongoose"

export interface IIdea extends Document {
  title: string
  description: string
  category: string
  author: {
    name: string
    regNumber: string
    avatar?: string
  }
  tags: string[]
  likes: number
  comments: Array<{
    author: {
      name: string
      regNumber: string
      avatar?: string
    }
    content: string
    createdAt: Date
  }>
  status: "open" | "in-progress" | "implemented"
  createdAt: Date
  updatedAt: Date
}

const IdeaSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [4, "Title must be at least 4 characters"],
      maxlength: [100, "Title must not exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["tech", "education", "social", "environment", "health", "other"],
    },
    author: {
      name: {
        type: String,
        required: [true, "Author name is required"],
      },
      regNumber: {
        type: String,
        required: [true, "Registration number is required"],
      },
      avatar: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        author: {
          name: String,
          regNumber: String,
          avatar: String,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["open", "in-progress", "implemented"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
IdeaSchema.index({ title: "text", description: "text" })
IdeaSchema.index({ category: 1 })
IdeaSchema.index({ "author.regNumber": 1 })
IdeaSchema.index({ createdAt: -1 })

export const Idea = mongoose.models.Idea || mongoose.model<IIdea>("Idea", IdeaSchema)

