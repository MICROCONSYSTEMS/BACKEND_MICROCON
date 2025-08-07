import { Feedback } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const CreateFeedback = async (req, res) => {
  try {
    const { user_id, product_id, rating, comment } = req.body;

    if (!user_id || !product_id || !rating) {
      return res.status(400).json({
        message: 'user_id, product_id, and rating are required',
        status: false,
        data: null
      });
    }

    const feedback = await Feedback.create({
      user_id: ConvertIntoMongoID(user_id),
      product_id: ConvertIntoMongoID(product_id),
      rating,
      comment
    });

    return res.status(201).json({
      message: 'Feedback created successfully',
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
