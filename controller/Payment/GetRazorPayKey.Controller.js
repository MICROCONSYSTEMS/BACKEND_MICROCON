export const GetRazorPayKeyController = async (req, res) => {
    try {
        const razorpayKey = process.env.RAZORPAY_KEY_ID;

        if (!razorpayKey) {
            return res.status(400).json({ error: 'Razorpay key not found' });
        }

        return res.status(200).json({
            success: true,
            key: razorpayKey,
        });
    } catch (error) {
        console.error('Error fetching Razorpay key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};