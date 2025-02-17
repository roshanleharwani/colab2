import mongoose, { Schema, type Document } from "mongoose"
export interface IProject extends Document {
  name: string
  description: string
  category: string
  projectType: string
  duration: string
  teamSize: string
  techStack: string[]
  githubUrl?: string
  leader: {
    name: string
    email: string
    regNumber: string
  }
  requirements: string
  members: mongoose.Types.ObjectId[]
  status: "Active" | "Completed" | "Cancelled"
  isRecruiting: boolean
  createdAt: Date
  updatedAt: Date
}
const MemberSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the JoinRequest model
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const ProjectSchema = new Schema(
  {

    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["web", "mobile", "ai", "blockchain", "iot", "game", "other"],
    },
    projectType: {
      type: String,
      required: [true, "Project type is required"],
      enum: ["academic", "personal", "startup", "research"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      enum: ["1-month", "2-3-months", "3-6-months", "6-plus"],
    },
    teamSize: {
      type: String,
      required: [true, "Team size is required"],
      enum: ["2", "3", "4", "5", "6-plus"],
    },
    techStack: {
      type: [String],
      required: [true, "Tech stack is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one technology is required",
      },
    },
    githubUrl: {
      type: String,
      validate: {
        validator: (v: string) => !v || /^https?:\/\/github\.com\/[\w-]+\/[\w-]+/.test(v),
        message: "Invalid GitHub URL",
      },
    },
    leader: {
      name: {
        type: String,
        required: [true, "Leader name is required"],
        minlength: [2, "Leader name must be at least 2 characters"],
      },
      email: {
        type: String,
        required: [true, "Leader email is required"],
        match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
      },
      regNumber: {
        type: String,
        required: [true, "Registration number is required"],
        minlength: [2, "Registration number must be at least 2 characters"],
      },
    },
    requirements: {
      type: String,
      required: [true, "Requirements are required"],
      minlength: [10, "Requirements must be at least 10 characters"],
    },
    members: [
      MemberSchema
    ],
    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
    isRecruiting: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
ProjectSchema.index({ name: "text", description: "text" })
ProjectSchema.index({ category: 1 })
ProjectSchema.index({ projectType: 1 })
ProjectSchema.index({ isRecruiting: 1 })

export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)

