import { Feedback } from '../../models/index.js';

export const GetAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('user_id').populate('product_id');

    return res.status(200).json({
      message: 'Feedbacks fetched successfully',
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
