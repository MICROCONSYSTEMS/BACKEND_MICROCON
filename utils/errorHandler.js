export const handleError = (res, error, message = 'An error occurred') => {
    res.status(500).json({ message, error: error.message });
};
