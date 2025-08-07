import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  photo: {
    filename: String,
    url: String,
    key: String, // folderName/filename for deletion
  },
}, { timestamps: true });

export const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
