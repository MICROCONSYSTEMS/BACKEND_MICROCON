import { TeamMember } from '../../models/index.js';
import { GetObjectURL } from '../../utils/GetObject.js';

export const GetAllMembers = async (req, res) => {
  try {
    const members = await TeamMember.find();

    const memberswithURLS = await Promise.all(
      members.map(async (member) => {
            const key = member.photo.key
            const signedUrl = await GetObjectURL(key);
    
            return {
              ...member.toObject(),
              image: {
                ...member.image,
                url: signedUrl,
              },
            };
          })
        );

    if (memberswithURLS.length === 0) {
      return res.status(200).json({ message: "No team members found", data: [] });
    }

    res.status(200).json({ message: "Fetched all team members", data: memberswithURLS });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch members",
      error: error.message,
    });
  }
};
