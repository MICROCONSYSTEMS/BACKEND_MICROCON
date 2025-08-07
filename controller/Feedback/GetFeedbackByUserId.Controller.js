import { Feedback } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const GetFeedbackByUserId = async (req, res) => {
  try {
    const userId = ConvertIntoMongoID(req.params.id);

    const feedbacks = await Feedback.find({ user_id: userId }).populate('product_id');

    return res.status(200).json({
      message: 'Feedbacks fetched successfully for the user',
      status: true,
      data: feedbacks
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      status: false,
      data: error.message
    });
  }
};
