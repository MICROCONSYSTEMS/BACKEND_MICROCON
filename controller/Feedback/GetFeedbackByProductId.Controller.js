import { Feedback } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const GetFeedbackByProductId = async (req, res) => {
  try {
    const productId = ConvertIntoMongoID(req.params.id);

    const feedbacks = await Feedback.find({ product_id: productId }).populate('user_id');

    return res.status(200).json({
      message: 'Feedbacks fetched successfully for the product',
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
