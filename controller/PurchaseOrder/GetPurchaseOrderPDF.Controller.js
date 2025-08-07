import { handleError } from '../../utils/errorHandler.js';
import { GetObjectURL } from '../../utils/GetObject.js';

export const GetPurchaseOrderPDF = async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ message: 'Key is required in query' });
    }

    const signedUrl = await GetObjectURL(key);
    return res.status(200).json({ pdfUrl: signedUrl });
  } catch (error) {
    handleError(res, error, 'Error fetching PO PDF');
  }
};
