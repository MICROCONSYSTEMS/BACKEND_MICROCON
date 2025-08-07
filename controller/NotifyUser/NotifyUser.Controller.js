import { NotifyUser } from "../../models/index.js";

export const RequestBackInStock = async (req, res) => {
  const { productId, email } = req.body;

  console.log(req.body);

  try {
    const alreadyRequested = await NotifyUser.findOne({ productId, email });

    if (alreadyRequested) {
      return res.status(400).json({ message: 'You have already requested notification.' });
    }

    const request = new NotifyUser({ productId, email, notified: true });
    await request.save();

    res.status(201).json({ message: 'You will be notified when product is in stock.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
