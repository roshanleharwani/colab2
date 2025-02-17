import mongoose, { Schema, type Document } from "mongoose"

export interface IStartup extends Document {
  name: string
  tagline: string
  description: string
  industry: string
  fundingStage: string
  founded: string
  location: string
  website?: string
  metrics: {
    users?: string
    growth?: string
    institutions?: string
  }
  maxTeamSize: string
  founder: {
    name: string
    email: string
    regNumber: string
    role: string
  }
  requirements: string
  members: mongoose.Types.ObjectId[]
  isRecruiting: boolean
  createdAt: Date
  updatedAt: Date
}

const StartupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Startup name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    tagline: {
      type: String,
      required: [true, "Tagline is required"],
      minlength: [5, "Tagline must be at least 5 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
      enum: ["Tech", "Health", "Edu", "Finance", "E-commerce", "Sustainability", "Other"],
    },
    fundingStage: {
      type: String,
      required: [true, "Funding stage is required"],
      enum: ["Ideation", "MVP", "Seed", "Series-A", "Series-B"],
    },
    founded: {
      type: String,
      required: [true, "Founded year is required"],
      validate: {
        validator: (v: string) => {
          const year = Number.parseInt(v)
          const currentYear = new Date().getFullYear()
          return year >= 2000 && year <= currentYear
        },
        message: "Invalid founding year",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      minlength: [2, "Location must be at least 2 characters"],
    },
    website: {
      type: String,
      validate: {
        validator: (v: string) => !v || /^https?:\/\/\S+\.\S+/.test(v),
        message: "Invalid website URL",
      },
    },
    metrics: {
      users: String,
      growth: String,
      institutions: String,
    },
    maxTeamSize: {
      type: String,
      required: [true, "Maximum team size is required"],
      enum: ["5", "10", "15", "20", "20+"],
    },
    founder: {
      name: {
        type: String,
        required: [true, "Founder name is required"],
        minlength: [2, "Founder name must be at least 2 characters"],
      },
      email: {
        type: String,
        required: [true, "Founder email is required"],
        match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
      },
      regNumber: {
        type: String,
        required: [true, "Registration number is required"],
        minlength: [2, "Registration number must be at least 2 characters"],
      },
      role: {
        type: String,
        required: [true, "Founder role is required"],
        minlength: [2, "Role must be at least 2 characters"],
      },
    },
    requirements: {
      type: String,
      required: [true, "Requirements are required"],
      minlength: [10, "Requirements must be at least 10 characters"],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
StartupSchema.index({ name: "text", description: "text", tagline: "text" })
StartupSchema.index({ industry: 1 })
StartupSchema.index({ fundingStage: 1 })
StartupSchema.index({ isRecruiting: 1 })

export const Startup = mongoose.models.Startup || mongoose.model<IStartup>("Startup", StartupSchema)

