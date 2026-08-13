const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = async (contact) => {
  await transporter.sendMail({
    from: `"Satyadeva Photography" <${process.env.EMAIL_USER}>`,

    to: "uday9988k@gmail.com",

    subject: `New Photography Enquiry - ${contact.name}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: auto;
        padding: 30px;
        background: #ffffff;
        color: #222222;
      ">

        <h2 style="
          color: #d4af37;
          margin-bottom: 5px;
        ">
          Satyadeva Photography
        </h2>

        <p style="
          color: #777777;
          margin-top: 0;
        ">
          New Contact Enquiry
        </p>

        <hr />

        <p>
          <strong>Name:</strong>
          ${contact.name}
        </p>

        <p>
          <strong>Location:</strong>
          ${contact.location}
        </p>

        <p>
          <strong>Phone Number:</strong>
          ${contact.phone}
        </p>

        <p>
          <strong>Message:</strong>
        </p>

        <div style="
          background: #f5f5f5;
          padding: 18px;
          border-left: 4px solid #d4af37;
          line-height: 1.6;
        ">
          ${contact.message}
        </div>

        <br />

        <p style="
          color: #888888;
          font-size: 12px;
        ">
          This enquiry was submitted through
          the Satyadeva Photography website.
        </p>

      </div>
    `,
  });
};

module.exports = sendContactEmail;
