import nodemailer from 'nodemailer';

export interface TrialRegistrationData {
  parentName?: string;
  phone?: string;
  address?: string;
  childAge?: string;
  learningFormat?: string;
}

export interface CtvRegistrationData {
  fullName?: string;
  phone?: string;
  email?: string;
}

export async function sendRegistrationEmail(
  type: 'trial' | 'ctv',
  data: TrialRegistrationData | CtvRegistrationData
) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE !== 'false'; // default to true
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.SMTP_TO;

  if (!user || !pass || !to) {
    console.warn(
      '[EMAIL NOTIFICATION] SMTP credentials or SMTP_TO is not configured in .env. Skipping email sending.'
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  let subject = '';
  let html = '';

  if (type === 'trial') {
    const trialData = data as TrialRegistrationData;
    subject = `[Vietsure English] Đăng ký dùng thử mới từ ${trialData.parentName || 'Khách hàng'}`;
    html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px;">Đăng ký Học thử Mới</h2>
        </div>
        <div style="padding: 20px;">
          <p>Xin chào Ban Quản Trị,</p>
          <p>Hệ thống vừa ghi nhận một yêu cầu đăng ký học thử mới với các thông tin chi tiết sau:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 35%;">Họ tên phụ huynh:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${trialData.parentName || 'Không cung cấp'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Số điện thoại:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <a href="tel:${trialData.phone || ''}" style="color: #007bff; text-decoration: none;">${trialData.phone || 'Không cung cấp'}</a>
              </td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Địa chỉ:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${trialData.address || 'Không cung cấp'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Tuổi của bé:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${trialData.childAge || 'Không cung cấp'} tuổi</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Hình thức học:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${trialData.learningFormat || 'Không cung cấp'}</td>
            </tr>
          </table>
          
          <p style="margin-top: 20px; font-size: 14px; color: #666; font-style: italic;">Vui lòng liên hệ với phụ huynh sớm để tư vấn và xếp lớp.</p>
        </div>
        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd;">
          Email này được gửi tự động từ hệ thống Vietsure English.
        </div>
      </div>
    `;
  } else {
    const ctvData = data as CtvRegistrationData;
    subject = `[Vietsure English] Đăng ký Cộng tác viên mới từ ${ctvData.fullName || 'Cộng tác viên'}`;
    html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px;">Đăng ký Cộng tác viên Mới</h2>
        </div>
        <div style="padding: 20px;">
          <p>Xin chào Ban Quản Trị,</p>
          <p>Hệ thống vừa ghi nhận một hồ sơ đăng ký làm Cộng tác viên (CTV) mới với các thông tin chi tiết sau:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 35%;">Họ tên CTV:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${ctvData.fullName || 'Không cung cấp'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Số điện thoại:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <a href="tel:${ctvData.phone || ''}" style="color: #007bff; text-decoration: none;">${ctvData.phone || 'Không cung cấp'}</a>
              </td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <a href="mailto:${ctvData.email || ''}" style="color: #007bff; text-decoration: none;">${ctvData.email || 'Không cung cấp'}</a>
              </td>
            </tr>
          </table>
          
          <p style="margin-top: 20px; font-size: 14px; color: #666; font-style: italic;">Vui lòng duyệt hồ sơ và liên hệ với cộng tác viên sớm.</p>
        </div>
        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd;">
          Email này được gửi tự động từ hệ thống Vietsure English.
        </div>
      </div>
    `;
  }

  const mailOptions = {
    from: `"Vietsure English Notification" <${user}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}
