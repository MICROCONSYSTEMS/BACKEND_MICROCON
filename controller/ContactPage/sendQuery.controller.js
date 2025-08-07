import { SendEmail } from '../../utils/SendMails.js';

export const sendQuery = async (req, res) => {
  try {
    const { name, email, message, phone, company, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const finalSubject = subject || `New Website Query from ${name}`;

    const htmlBody = `
      <h2>New Query Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    await SendEmail({
      to: email,
      subject: finalSubject,
      html: htmlBody,
    });

    res.status(200).json({ message: 'Query sent successfully!' });
  } catch (error) {
    console.error("Error in sendQuery:", error);
    res.status(500).json({ error: 'Something went wrong while sending your query.' });
  }
};
