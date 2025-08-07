import { Feedback } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const DeleteFeedback = async (req, res) => {
  try {
    const id = ConvertIntoMongoID(req.params.id);

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({
        message: 'Feedback not found',
        status: false,
        data: null
      });
    }

    return res.status(200).json({
      message: 'Feedback deleted successfully',
      status: true,
      data: feedback
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      status: false,
      data: error.message
    });
  }
};
