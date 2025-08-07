import RazorPayInstance from "../../config/RazorPay.js";

export const ProcessPaymentController = async (req, res) => {
    try {
      const { amount, currency = 'INR' } = req.body;
      console.log(req.body);
  
      const options = {
        amount: Math.round(amount * 100),
        currency,
      };
  
      const order = await RazorPayInstance.orders.create(options);

      console.log(order)

      return res.status(200).json({ 
        statusCode: 200, 
        message: 'Razorpay order created successfully', 
        data: order 
    });
    } catch (error) {
      return res.status(500).json({ 
        statusCode: 500, 
        message: 'Failed to create Razorpay order', 
        data: error 
    });
    }
  };