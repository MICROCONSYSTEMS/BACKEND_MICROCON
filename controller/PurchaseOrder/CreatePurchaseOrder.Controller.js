import { PurchaseOrder } from '../../models/index.js';
import { handleError } from '../../utils/errorHandler.js';
import { PutObject } from '../../utils/PutObject.js';
import { AdjustStock } from '../../utils/AdjustStock.js';
import { ConvertIntoMongoID } from '../../utils/ConvertIntoMongoID.js';

export const CreatePurchaseOrder = async (req, res) => {
  try {
    console.log('[START] CreatePurchaseOrder triggered');
    const { purchaseOrderId, totalAmount } = req.body;
    const pdfFile = req.file;
    let items = req.body.items;

    console.log('[INFO] purchaseOrderId:', purchaseOrderId);
    console.log('[INFO] totalAmount:', totalAmount);
    console.log('[INFO] items (raw):', items);
    console.log('[INFO] pdfFile:', pdfFile);

    if (!purchaseOrderId?.trim()) {
      console.log('[ERROR] Missing purchaseOrderId');
      return res.status(400).json({ message: 'Purchase Order ID is required' });
    }

    if (!totalAmount || isNaN(totalAmount) || Number(totalAmount) < 0) {
      console.log('[ERROR] Invalid totalAmount');
      return res.status(400).json({ message: 'Valid total amount is required' });
    }

    if (!items) {
      console.log('[ERROR] Missing items field');
      return res.status(400).json({ message: 'Items field is required' });
    }

    if (typeof items === 'string') {
      console.log('[INFO] Parsing items JSON');
      try {
        items = JSON.parse(items);
        console.log('[INFO] Parsed items:', items);
      } catch (e) {
        console.log('[ERROR] Failed to parse items JSON', e);
        return res.status(400).json({ message: 'Invalid items format (not valid JSON)' });
      }
    }

    if (!Array.isArray(items) || items.length === 0) {
      console.log('[ERROR] Items is not a non-empty array');
      return res.status(400).json({ message: 'At least one item is required' });
    }

    if (!pdfFile) {
      console.log('[ERROR] Missing pdfFile');
      return res.status(400).json({ message: 'PDF file is required' });
    }

    console.log('[INFO] Converting product IDs to ObjectIds');
    items = items.map(item => {
      const converted = {
        ...item,
        product: ConvertIntoMongoID(item.product)
      };
      console.log('[DEBUG] Converted item:', converted);
      return converted;
    });

    console.log('[INFO] Adjusting stock');
    try {
      await AdjustStock(items);
    } catch (adjustErr) {
      return res.status(400).json({ message: adjustErr.message });
    }
    console.log('[INFO] Stock adjusted');

    const fileName = `${Date.now()}-${pdfFile.originalname}`;
    console.log('[INFO] Uploading file to S3 with filename:', fileName);

    const s3Result = await PutObject({
      folderName: 'purchase-orders',
      fileName,
      fileBuffer: pdfFile.buffer,
      contentType: pdfFile.mimetype,
    });

    console.log('[INFO] File uploaded to S3:', s3Result);

    const order = new PurchaseOrder({
      purchaseOrderId,
      items,
      totalAmount,
      pdf: {
        url: s3Result.url,
        fileName: s3Result.filename,
      },
    });

    console.log('[INFO] Saving order to DB');
    await order.save();
    console.log('[SUCCESS] Order saved');

    res.status(200).json({ message: 'Purchase order created', data: order });
  } catch (error) {
    console.log('[FATAL] Exception caught:', error);
    handleError(res, error, 'Error creating purchase order');
  }
};
