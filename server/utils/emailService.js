import nodemailer from 'nodemailer';

/**
 * Creates Nodemailer transporter using environment SMTP settings.
 * If credentials are invalid/default, it logs gracefully without crashing.
 */
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = Number(process.env.EMAIL_PORT) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass || pass === 'your_gmail_app_password') {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

/**
 * Send 6-Digit Password Reset Code via Nodemailer
 */
export const sendForgotPasswordEmail = async (email, name, otpCode) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log(`ℹ️ [Nodemailer Reset] Code ${otpCode} generated for ${email}. (SMTP pending in .env)`);
      return { success: false, message: 'SMTP credentials pending in server/.env', otpCode };
    }

    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e5c07b;">
          
          <div style="background: linear-gradient(135deg, #121216, #2d1b12); padding: 25px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; color: #C9982F; font-size: 22px; letter-spacing: 1px;">HALWIYAT ZAMZAM BAKERS</h1>
            <p style="margin: 4px 0 0 0; color: #dddddd; font-size: 12px; text-transform: uppercase;">Password Reset Request</p>
          </div>

          <div style="padding: 24px; text-align: center;">
            <h2 style="color: #2d1b12; margin-top: 0; font-size: 18px;">Hello, ${name || 'Customer'}! 🔑</h2>
            <p style="font-size: 14px; color: #555; line-height: 1.5; margin-bottom: 20px;">
              You requested to reset your password. Use the following 6-digit verification code:
            </p>

            <div style="background-color: #fffdf9; border: 2px dashed #C9982F; border-radius: 12px; padding: 16px; margin: 20px 0; display: inline-block;">
              <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #b88319; font-family: monospace;">${otpCode}</span>
            </div>

            <p style="font-size: 12px; color: #777; margin-top: 15px;">
              This code will expire in <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.
            </p>
          </div>

          <div style="background-color: #121216; padding: 12px; text-align: center; color: #888888; font-size: 11px;">
            Timergara, Dir Lower • Halwiyat Zamzam Security Team
          </div>

        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Halwiyat Zamzam Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔑 ${otpCode} is your Password Reset Code — Halwiyat Zamzam`,
      html: htmlTemplate
    });

    console.log(`✅ [Nodemailer Reset] Code ${otpCode} sent to ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('⚠️ [Nodemailer Reset] Error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send 6-Digit Email OTP Verification Code to Customer
 */
export const sendOtpVerificationEmail = async (email, name, otpCode) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log(`ℹ️ [Nodemailer OTP] Code ${otpCode} generated for ${email}. (SMTP pending in .env)`);
      return { success: false, message: 'SMTP credentials pending in server/.env', otpCode };
    }

    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e5c07b;">
          
          <div style="background: linear-gradient(135deg, #121216, #2d1b12); padding: 25px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; color: #C9982F; font-size: 22px; letter-spacing: 1px;">HALWIYAT ZAMZAM BAKERS</h1>
            <p style="margin: 4px 0 0 0; color: #dddddd; font-size: 12px; text-transform: uppercase;">Email Verification Code</p>
          </div>

          <div style="padding: 24px; text-align: center;">
            <h2 style="color: #2d1b12; margin-top: 0; font-size: 18px;">Hello, ${name || 'Customer'}! 👋</h2>
            <p style="font-size: 14px; color: #555; line-height: 1.5; margin-bottom: 20px;">
              Please use the following 6-digit verification code to activate your account on Halwiyat Zamzam Bakers.
            </p>

            <!-- OTP Box -->
            <div style="background-color: #fffdf9; border: 2px stroke #C9982F; border: 2px dashed #C9982F; border-radius: 12px; padding: 16px; margin: 20px 0; display: inline-block;">
              <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #b88319; font-family: monospace;">${otpCode}</span>
            </div>

            <p style="font-size: 12px; color: #777; margin-top: 15px;">
              This code will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.
            </p>
          </div>

          <div style="background-color: #121216; padding: 12px; text-align: center; color: #888888; font-size: 11px;">
            Timergara, Dir Lower • Halwiyat Zamzam Bakers Security Team
          </div>

        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Halwiyat Zamzam Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔐 ${otpCode} is your Halwiyat Zamzam Verification Code`,
      html: htmlTemplate
    });

    console.log(`✅ [Nodemailer OTP] Code ${otpCode} sent to ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('⚠️ [Nodemailer OTP] Error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send branded Order Receipt Email to Customer
 */
export const sendOrderConfirmationEmail = async (order) => {
  try {
    const transporter = createTransporter();
    
    // Log intent if SMTP credentials not fully configured
    if (!transporter) {
      console.log(`ℹ️ [Nodemailer] Order #${order.orderId} receipt created. (SMTP credentials pending in .env file)`);
      return { success: false, message: 'SMTP credentials pending in server/.env' };
    }

    const itemsHtml = order.items.map(it => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${it.name}</strong> (${it.selectedOption || '1 Pcs'})
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          x${it.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-family: monospace;">
          Rs. ${it.price * it.quantity}
        </td>
      </tr>
    `).join('');

    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e5c07b;">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #121216, #2d1b12); padding: 30px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; color: #C9982F; font-size: 24px; letter-spacing: 1px;">HALWIYAT ZAMZAM BAKERS</h1>
            <p style="margin: 5px 0 0 0; color: #dddddd; font-size: 12px; text-transform: uppercase;">Timergara, Dir Lower • Order Receipt</p>
          </div>

          <!-- Content Body -->
          <div style="padding: 24px;">
            <h2 style="color: #2d1b12; margin-top: 0; font-size: 18px;">Thank you for your order, ${order.customerName}! 🎉</h2>
            <p style="font-size: 14px; color: #555; line-height: 1.5;">
              We have received your order <strong>#${order.orderId}</strong> at our Timergara counter. Our pastry chefs are preparing your fresh items!
            </p>

            <!-- Order Summary Box -->
            <div style="background-color: #fffdf9; border: 1px solid #f0e6d2; border-radius: 12px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="border-bottom: 2px solid #C9982F; color: #8b6012;">
                    <th style="text-align: left; padding: 8px;">Item</th>
                    <th style="text-align: center; padding: 8px;">Qty</th>
                    <th style="text-align: right; padding: 8px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div style="border-top: 2px solid #C9982F; margin-top: 12px; padding-top: 12px; text-align: right;">
                <span style="font-size: 14px; font-weight: bold; color: #333;">Total Amount Payable: </span>
                <span style="font-size: 18px; font-weight: bold; color: #b88319; font-family: monospace;">Rs. ${order.totalAmount}</span>
              </div>
            </div>

            <!-- Delivery / Pickup Info -->
            <div style="background-color: #f4f6f8; border-radius: 10px; padding: 14px; font-size: 13px; margin-bottom: 20px;">
              <p style="margin: 0 0 6px 0;"><strong>Customer Name:</strong> ${order.customerName}</p>
              <p style="margin: 0 0 6px 0;"><strong>Customer Contact Phone:</strong> ${order.customerPhone}</p>
              <p style="margin: 0 0 6px 0;"><strong>Order Type:</strong> ${order.orderType === 'Delivery' ? '🛵 Home Delivery (Rs. 150)' : '🏪 Counter Pickup'}</p>
              <p style="margin: 0;"><strong>Delivery Address:</strong> ${order.customerAddress || 'Counter Pickup at Bakery'}</p>
            </div>

            <p style="font-size: 12px; color: #888; text-align: center;">
              You can track your order status live at any time on our website using Order ID: <strong>#${order.orderId}</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #121216; padding: 15px; text-align: center; color: #888888; font-size: 11px;">
            <p style="margin: 0;">Halwiyat Zamzam Bakers • Main Bazaar, Timergara, Dir Lower</p>
            <p style="margin: 4px 0 0 0;">WhatsApp Order Support: +92 327 5001166</p>
          </div>

        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Halwiyat Zamzam Bakers" <${process.env.EMAIL_USER}>`,
      to: order.customerEmail || process.env.EMAIL_USER,
      subject: `🍰 Order Receipt #${order.orderId} — Halwiyat Zamzam Bakers`,
      html: htmlTemplate
    });

    console.log(`✅ [Nodemailer] Order confirmation email sent to ${order.customerEmail || order.customerName}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('⚠️ [Nodemailer] Email dispatch error:', error.message);
    return { success: false, error: error.message };
  }
};
