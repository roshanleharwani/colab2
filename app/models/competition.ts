import mongoose, { Schema, type Document } from "mongoose"

export interface ICompetition extends Document {
  name: string
  description: string
  type: string
  startDate: Date
  endDate: Date
  maxTeamSize: string
  prize: string
  requirements: string
  rules: string
  teams: mongoose.Types.ObjectId[]
  status: "upcoming" | "ongoing" | "completed"
  createdAt: Date
  updatedAt: Date
}

const CompetitionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Competition name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    type: {
      type: String,
      required: [true, "Competition type is required"],
      enum: ["Hackathon", "Ideathon", "Coding", "Design"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: (v: Date) => v >= new Date(),
        message: "Start date must be in the future",
      },
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (this: ICompetition, v: Date) {
          return v > this.startDate
        },
        message: "End date must be after start date",
      },
    },
    maxTeamSize: {
      type: String,
      required: [true, "Maximum team size is required"],
      enum: ["2", "3", "4", "5", "6"],
    },
    prize: {
      type: String,
      required: [false, "Prize details are required"],
      minlength: [1, "Prize details must not be empty"],
    },
    requirements: {
      type: String,
      required: [true, "Requirements are required"],
      minlength: [10, "Requirements must be at least 10 characters"],
    },
    rules: {
      type: String,
      required: [true, "Rules are required"],
      minlength: [10, "Rules must be at least 10 characters"],
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
CompetitionSchema.index({ name: "text", description: "text" })
CompetitionSchema.index({ type: 1 })
CompetitionSchema.index({ startDate: 1 })
CompetitionSchema.index({ status: 1 })

// Pre-save middleware to update status based on dates
CompetitionSchema.pre("save", function (next) {
  const now = new Date()
  if (this.startDate > now) {
    this.status = "Upcoming"
  } else if (this.endDate < now) {
    this.status = "Completed"
  } else {
    this.status = "Ongoing"
  }
  next()
})

export const Competition = mongoose.models.Competition || mongoose.model<ICompetition>("Competition", CompetitionSchema)

