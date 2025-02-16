import mongoose, { Schema, type Document } from "mongoose"

export interface ITeam extends Document {
  name: string
  description: string
  competition: mongoose.Types.ObjectId
  leader: {
    id: mongoose.Types.ObjectId
    name: string
    regNumber: string
    role: string
  }
  members: Array<{
    id: mongoose.Types.ObjectId
    name: string
    regNumber: string
    role: string
  }>
  isRecruiting: boolean
  createdAt: Date
  updatedAt: Date
}

const TeamSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    competition: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: [true, "Competition reference is required"],
    },
    leader: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      regNumber: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
    },
    members: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        name: String,
        regNumber: String,
        role: String,
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
TeamSchema.index({ name: "text", description: "text" })
TeamSchema.index({ competition: 1 })
TeamSchema.index({ isRecruiting: 1 })

// Virtual for total members count
TeamSchema.virtual("memberCount").get(function (this: ITeam) {
  return this.members.length + 1 // +1 for the leader
})

export const Team = mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema)

