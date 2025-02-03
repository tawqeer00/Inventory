const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");



const contactUs = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }

  //   Validation
  if (!subject || !message) {
    res.status(400);
    throw new Error("Please add subject and message");
  }

  const send_to = process.env.EMAIL_USER;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = user.email;
  try {
    await sendEmail(subject, message, send_to, sent_from, reply_to);
    res.status(200).json({ success: true, message: "Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});


const sendInvoiceEmail = asyncHandler(async (req, res) => {
  const { customerEmail, subject, htmlContent } = req.body;

  if (!customerEmail || !subject || !htmlContent) {
    res.status(400);
    throw new Error("Customer email, subject, and HTML content are required");
  }

  try {
    await sendEmail(
      subject,
      "", // Text content can be empty if the email is HTML-based
      customerEmail,
      process.env.EMAIL_USER,
      undefined,
      undefined, // No attachments needed
      htmlContent // Pass HTML content
    );

    res.status(200).json({
      success: true,
      message: `Invoice sent to ${customerEmail}`,
    });
  } catch (error) {
    console.error("Error sending invoice email:", error);
    res.status(500);
    throw new Error("Failed to send invoice email");
  }
});











module.exports = {
  contactUs,sendInvoiceEmail
};
