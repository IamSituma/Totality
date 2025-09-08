require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 5000;

// Resend API key
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// Advanced HTML email template
function EmailTemplate(email, position = null) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Totality Waitlist</title>
      <style>
        body { margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f5f5f5; text-align:center; }
        a { color:#4F46E5; text-decoration:none; }
        .button { background-color:#000000; color:#ffffff; padding:12px 24px; border-radius:6px; display:inline-block; text-align:center; }
        .container { max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; overflow:hidden; text-align:center; }
        .header { background-color:#4F46E5; padding:20px; }
        .body { padding:30px; color:#111827; text-align:center; }
        .footer { 
          background-color:#D3DAD9; 
          padding:10px; 
          text-align:center; 
          font-size:14px; 
          color:#000000; 
          line-height:1.3; /* tighter line spacing */
        }
        .footer a { color:#000000; text-decoration:none; }
        .footer p { margin:4px 0; } /* reduce spacing between footer lines */
      </style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table class="container" cellpadding="0" cellspacing="0">
              
              <!-- Header -->
              <tr>
                <td class="header">
                  <img src="https://yourdomain.com/assets/logo.png" alt="Totality Logo" style="max-width:150px; display:block; margin:0 auto;">
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td class="body">
                  <h2>Totality Logistics</h2>
                  <p>Hi there,</p>
                  <p>Thank you for joining our waitlist. We're building the future of logistics in Uganda. Stay tuned and we will keep you updated on our progress.</p>
                  ${position ? `<p style="font-weight:bold;">Your Current Waitlist Position: ${position}</p>` : ''}
                  <p style="text-align:center; margin:20px 0;">
                    <a href="https://totality.com" class="button">Visit Totality</a>
                  </p>
                  <p>We can't wait to share updates with you.</p>
                  <p>Best regards,<br>The Totality Team.</p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p>Totality, 2025</p>
                  <p>Kampala, Uganda</p>
                  <p><a href="mailto:totalityops@proton.me">totalityops@proton.me</a></p>
                  <p>
                    <a href="https://x.com/@tootality" target="_blank">X</a> | 
                    <a href="https://discord.com/invite/jyXs6EYM" target="_blank">Discord</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

// Create waitlist table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).then(() => console.log('✅ Waitlist table ready'))
  .catch(err => console.error('❌ Error creating table:', err));

// Get waitlist count
app.get('/waitlist', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM waitlist');
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add email to waitlist and send welcome email
app.post('/waitlist', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // Add to database
    const result = await pool.query(
      'INSERT INTO waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING *',
      [email]
    );

    // Count current waitlist position
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM waitlist WHERE id <= (SELECT id FROM waitlist WHERE email=$1)',
      [email]
    );
    const position = parseInt(countResult.rows[0].count);

    if (result.rowCount === 0) {
      return res.status(200).json({ message: 'Email already on the waitlist', position });
    }

    // Sender & recipient setup
    const fromEmail =
      process.env.NODE_ENV === "production"
        ? "Totality Logistics <onboarding@totality.com>"
        : "Totality Logistics <onboarding@resend.dev>";

    const toEmail =
      process.env.NODE_ENV === "production"
        ? email
        : process.env.VERIFIED_EMAIL; // sandbox: only send to your verified email

    // Send email
    try {
      const data = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: "Congratulations",
        html: EmailTemplate(email, position),
      });

      console.log(`📧 Email send attempt from ${fromEmail} → ${toEmail}`);
      console.log("Resend response:", data);
    } catch (emailError) {
      console.error("❌ Error sending email:", emailError);
    }

    res.status(201).json({
      message: "Successfully joined the waitlist and email send attempted",
      entry: result.rows[0],
      position,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
