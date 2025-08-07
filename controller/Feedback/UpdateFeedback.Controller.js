import { Feedback } from '../../models/index.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const UpdateFeedback = async (req, res) => {
  try {
    const id = ConvertIntoMongoID(req.params.id);
    const { rating, comment } = req.body;

    if (!rating && !comment) {
      return res.status(400).json({
        message: 'At least one of rating or comment is required to update',
        status: false,
        data: null
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { ...(rating && { rating }), ...(comment && { comment }) },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        message: 'Feedback not found',
        status: false,
        data: null
      });
    }

    return res.status(200).json({
      message: 'Feedback updated successfully',
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
