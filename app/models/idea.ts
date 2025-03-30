import mongoose, { Schema, type Document } from "mongoose"

export interface IIdea extends Document {
  title: string
  description: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
  updatedAt: Date
  likes: Array<{
    userId: string
    createdAt: Date
  }>
  comments: Array<{
    _id: string
    author: {
      id: string
      name: string
      avatar?: string
    }
    content: string
    createdAt: Date
  }>
  tags: string[]
}

const IdeaSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title must not exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    author: {
      id: {
        type: String,
        required: [true, "Author ID is required"],
      },
      name: {
        type: String,
        required: [true, "Author name is required"],
      },
      avatar: String,
    },
    likes: [
      {
        userId: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        author: {
          id: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          avatar: String,
        },
        content: {
          type: String,
          required: true,
          minlength: [1, "Comment cannot be empty"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [String],
  },
  {
    timestamps: true,
  },
)

// Create indexes for better query performance
IdeaSchema.index({ title: "text", description: "text" })
IdeaSchema.index({ createdAt: -1 })
IdeaSchema.index({ "author.id": 1 })
IdeaSchema.index({ "likes.userId": 1 })

export const Idea = mongoose.models.Idea || mongoose.model<IIdea>("Idea", IdeaSchema)

