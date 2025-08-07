import { TeamMember } from "../../models/index.js";
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js'
import { DeleteObject } from '../../utils/DeleteObject.js'

export const DeleteMember = async (req, res) => {
    try {
      const memberId = ConvertIntoMongoID(req.params.memberId);
      const member = await TeamMember.findById(memberId);
  
      if (!member) return res.status(404).json({ message: "Member not found" });
  
      if (member.photo.key) await DeleteObject(member.photo.key);
  
      await TeamMember.findByIdAndDelete(memberId);
  
      res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete member", error: error.message });
    }
  };
  