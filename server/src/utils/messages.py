def verificationMessage(verificationLink:str, name:str):
    return f"""
      <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to VectorPay</title>
                <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
            </head>
            <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:'Inter',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
            
            <main style="display:flex;justify-content:center;padding:40px 16px;">
                <article style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                <header style="padding:48px 40px 32px 40px;">
                   <img src="https://lgbwtjxyjaljjpzxytfx.supabase.co/storage/v1/object/sign/uploads/logo.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZTNmYjdhMi01YmYyLTQ3NzMtYTVmMS03M2Y2MjNhMmVjMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cGxvYWRzL2xvZ28uanBlZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODQ4OTkwMjcsImV4cCI6MzMzMjA4OTkwMjd9.ht7OUhcKcCFfn5BOgSVpG2s6WExXEQxvJaziPaMD20A" alt="VectorPay" />
                </header>
                <section style="padding:0 40px 24px 40px;text-align:center;">
                    <h1 style="margin:0;font-family:'Space Grotesk',Arial,sans-serif;font-size:32px;font-weight:700;color:#021F3D;letter-spacing:-0.8px;line-height:1.15;">Welcome to VectorPay</h1>
                     <h3 style="text-align: left; margin: 40px 40px 0; font-size: 18px; ">Hi {name}, </h3>
                    <p style="margin:10px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:14px;color:#4b5563;line-height:1.65;max-width:440px;display:inline-block;">
                    Your account is almost ready. Verify your email to unlock instant payouts, global transfers, and bank-grade security — all in one place.
                    </p>
                </section>
                <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 40px;">
                <section style="padding:32px 40px 40px 40px;text-align:center;">
                    <p style="margin:0 0 20px 0;font-family:'Inter',Arial,sans-serif;font-size:14px;color:#6b7280;">Click below to verify your account and get started.</p>
                    <p style="margin: -10px 0px 25px 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#dc2626; background-color: #f3e0e0; padding: 8px 5px; border-radius: 2px;">⚠️ For Security, this verification link will expire after 20 minutes.</p>
                    <a
                    href={verificationLink}
                    style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#03457C 0%,#0A5FA8 100%);color:#ffffff;font-family:'Inter',Arial,sans-serif;font-size:16px;font-weight:600;text-decoration:none;border-radius:9999px;letter-spacing:-0.2px;box-shadow:0 4px 14px rgba(3,69,124,0.25);"
                    >
                    Verify my account
                    </a>
                    <p style="margin:24px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;color:#9ca3af;line-height:1.5;">
                    Or copy and paste this link into your browser:<br/>
                    <a href={verificationLink} style="color:#03457C;text-decoration:underline;font-weight:500;">{verificationLink}</a>
                    </p>
                </section>
                <section style="padding:0 40px 40px 40px;">
                    <div style="display:flex;gap:16px;">
                    <div style="flex:1;text-align:center;padding:16px 8px;">
                        <div style="padding: 7px 10px ; border-radius:8px;background-color:#EFF6FF;display:inline-flex;align-items:center;justify-content:center;margin:0 auto;">
                        <span style="font-size:16px;color:#03457C;">&#9889;</span>
                        </div>
                        <p style="margin:10px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:600;color:#111827;">Peer-to-Peer Transfers</p>
                        <p style="margin:4px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.5;">Send and receive funds across accounts instantly. Experience frictionless peer-to-peer payments with zero processing delays or hidden transfer fees.</p>
                    </div>
                    <div style="flex:1;text-align:center;padding:16px 8px;">
                        <div style="padding: 7px 10px ; border-radius:8px;background-color:#EFF6FF;display:inline-flex;align-items:center;justify-content:center;margin:0 auto;">
                        <span style="font-size:16px;color:#03457C;">&#127974;</span>
                        </div>
                        <p style="margin:10px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:600;color:#111827;">Seamless Bank Links</p>
                        <p style="margin:4px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.5;">Deposit funds or withdraw cash directly to your local bank account. Enjoy secure, high velocity payouts engineered for instant retail processing.</p>
                    </div>
                    <div style="flex:1;text-align:center;padding:16px 8px;">
                        <div style="padding: 7px 10px ; border-radius:8px;background-color:#EFF6FF;display:inline-flex;align-items:center;justify-content:center;margin:0 auto;">
                        <span style="font-size:16px;color:#03457C;">&#128274;</span>
                        </div>
                        <p style="margin:10px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:600;color:#111827;">Compliance, handled</p>
                        <p style="margin:4px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.5;">DKYC, KYB, sanctions, and ongoing monitoring built into every flow. Audit-ready from day one.</p>
                    </div>
                    </div>
                </section>
                <footer style="padding:24px 40px;background-color:#F9FAFB;text-align:center;">
                    <p style="margin:0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#9ca3af;line-height:1.6;">
                    &copy; 2026 VectorPay, Inc. All rights reserved.<br/>
                    VectorPay is a financial technology company, not a bank.
                    </p>
                    <p style="margin:12px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#9ca3af;">
                    <a href="#" style="color:#6b7280;text-decoration:none;">Privacy</a> &nbsp;&bull;&nbsp;
                    <a href="#" style="color:#6b7280;text-decoration:none;">Terms</a> &nbsp;&bull;&nbsp;
                    <a href="#" style="color:#6b7280;text-decoration:none;">Support</a>
                    </p>
                </footer>
                </article>
            </main>
            <!-- Preview text (hidden) -->
            <div style="display:none;max-height:0px;overflow:hidden;">
                Verify your email to start moving money globally with VectorPay.
            </div>
            </body>
        </html>


"""


def email_otp_messsage(code:str, name:str):
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your VectorPay verification code</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:'Inter',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <main style="display:flex;justify-content:center;padding:40px 16px;">
    <article style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
      <header style="padding:48px 40px 32px 40px;">
       <img src="https://lgbwtjxyjaljjpzxytfx.supabase.co/storage/v1/object/sign/uploads/logo.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZTNmYjdhMi01YmYyLTQ3NzMtYTVmMS03M2Y2MjNhMmVjMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cGxvYWRzL2xvZ28uanBlZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODQ4OTkwMjcsImV4cCI6MzMzMjA4OTkwMjd9.ht7OUhcKcCFfn5BOgSVpG2s6WExXEQxvJaziPaMD20A" alt="VectorPay" />
      </header>
      <section style="padding:0 40px 24px 40px;text-align:center;">
        <h1 style="margin:0;font-family:'Space Grotesk',Arial,sans-serif;font-size:32px;font-weight:700;color:#021F3D;letter-spacing:-0.8px;line-height:1.15;">Verify your identity</h1>
        <h3 style="text-align: left; margin: 40px 40px 0; font-size: 18px; ">Hi {name}, </h3>

        <p style="margin:10px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:16px;color:#4b5563;line-height:1.65;max-width:440px;display:inline-block;">
          Use the code below to complete your sign-in. It expires in 5 minutes for your security. Never share this code with anyone.
        </p>
      </section>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 40px;">
      <section style="padding:32px 40px 40px 40px;text-align:center;">
        <p style="margin:0 0 20px 0;font-family:'Inter',Arial,sans-serif;font-size:14px;color:#6b7280;">Your verification code</p>
        <div style="display:inline-block;padding:20px 48px;background:linear-gradient(135deg,#03457C 0%,#0A5FA8 100%);border-radius:16px;box-shadow:0 4px 14px rgba(3,69,124,0.25);">
          <span style="font-family:'Space Grotesk',Arial,sans-serif;font-size:36px;font-weight:700;color:#ffffff;letter-spacing:8px;">{code}</span>
        </div>
        <p style="margin:24px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;color:#9ca3af;line-height:1.5;">
          If you didn't request this code, you can safely ignore this email. Someone may have entered your email by mistake.
        </p>
      </section>
      <section style="padding:0 40px 40px 40px;">
        <div style="display:flex;gap:16px;">
          <div style="flex:1;text-align:center;padding:16px 8px;">
            <div style="width:36px;height:36px;border-radius:8px;background-color:#EFF6FF;display:inline-flex;align-items:center;justify-content:center;margin:0 auto;">
              <span style="font-size:16px;color:#03457C;">&#128274;</span>
            </div>
            <p style="margin:10px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:600;color:#111827;">Never share your code</p>
            <p style="margin:4px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.5;">VectorPay will never ask for your OTP via phone, chat, or email. Keep it private at all times.</p>
          </div>
          <div style="flex:1;text-align:center;padding:16px 8px;">
            <div style="width:36px;height:36px;border-radius:8px;background-color:#EFF6FF;display:inline-flex;align-items:center;justify-content:center;margin:0 auto;">
              <span style="font-size:16px;color:#03457C;">&#9200;</span>
            </div>
            <p style="margin:10px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:600;color:#111827;">Expires in 5 min</p>
            <p style="margin:4px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.5;">For your protection, codes expire quickly. Request a new one if this expires before you use it.</p>
          </div>
          <div style="flex:1;text-align:center;padding:16px 8px;">
            <div style="width:36px;height:36px;border-radius:8px;background-color:#EFF6FF;display:inline-flex;align-items:center;justify-content:center;margin:0 auto;">
              <span style="font-size:16px;color:#03457C;">&#128172;</span>
            </div>
            <p style="margin:10px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:600;color:#111827;">Need help?</p>
            <p style="margin:4px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.5;">Contact our support team anytime. We're here to keep your account secure.</p>
          </div>
        </div>
      </section>
      <footer style="padding:24px 40px;background-color:#F9FAFB;text-align:center;">
        <p style="margin:0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#9ca3af;line-height:1.6;">
          &copy; 2026 VectorPay, Inc. All rights reserved.<br/>
          VectorPay is a financial technology company, not a bank.
        </p>
        <p style="margin:12px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#9ca3af;">
          <a href="#" style="color:#6b7280;text-decoration:none;">Privacy</a> &nbsp;&bull;&nbsp;
          <a href="#" style="color:#6b7280;text-decoration:none;">Terms</a> &nbsp;&bull;&nbsp;
          <a href="#" style="color:#6b7280;text-decoration:none;">Support</a>
        </p>
      </footer>
    </article>
  </main>
  <!-- Preview text (hidden) -->
  <div style="display:none;max-height:0px;overflow:hidden;">
    Your VectorPay verification code is inside. Expires in 5 minutes.
  </div>
</body>
</html>


"""

def resetPasswordMessage(resetLink:str):
    return f"""
     <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to VectorPay</title>
                <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
            </head>
            <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:'Inter',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
            
            <main style="display:flex;justify-content:center;padding:40px 16px;">
                <article style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                <header style="padding:48px 40px 32px 40px;">
                   <img src="https://lgbwtjxyjaljjpzxytfx.supabase.co/storage/v1/object/sign/uploads/logo.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZTNmYjdhMi01YmYyLTQ3NzMtYTVmMS03M2Y2MjNhMmVjMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cGxvYWRzL2xvZ28uanBlZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODQ4OTkwMjcsImV4cCI6MzMzMjA4OTkwMjd9.ht7OUhcKcCFfn5BOgSVpG2s6WExXEQxvJaziPaMD20A" alt="VectorPay" />
                </header>
                <section style="padding:0 40px 24px 40px;text-align:center;">
                    <h1 style="margin:0;font-family:'Space Grotesk',Arial,sans-serif;font-size:32px;font-weight:700;color:#021F3D;letter-spacing:-0.8px;line-height:1.15;">Reset your password</h1>
                    
                    <p style="margin:16px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:14px;color:#4b5563;line-height:1.65;max-width:440px;display:inline-block;">
                    We received a request to reset your VectorPay password. Click the button below to choose a new one. This link will expire in 20 minutes for your security.
                    </p>
                </section>
                <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 40px;">
                <section style="padding:32px 40px 40px 40px;text-align:center;">
                    <p style="margin:0 0 20px 0;font-family:'Inter',Arial,sans-serif;font-size:14px;color:#6b7280;">Click below to reset your password.</p>
                  
                    <a
                    href={resetLink}
                    style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#03457C 0%,#0A5FA8 100%);color:#ffffff;font-family:'Inter',Arial,sans-serif;font-size:16px;font-weight:600;text-decoration:none;border-radius:9999px;letter-spacing:-0.2px;box-shadow:0 4px 14px rgba(3,69,124,0.25);"
                    >
                   Reset password
                    </a>
                    <p style="margin:24px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;color:#9ca3af;line-height:1.5;">
                    Or copy and paste this link into your browser:<br/>
                    <a href={resetLink} style="color:#03457C;text-decoration:underline;font-weight:500;">{resetLink}</a>
                    </p>
                </section>
                <section style="padding:0 40px 40px 40px;">
                    <div style="display:flex;gap:16px;">
                    <div style="flex:1;text-align:center;padding:16px 8px;">
                        <div style="padding: 7px 10px ; border-radius:8px;background-color:#EFF6FF;display:inline-flex;align-items:center;justify-content:center;margin:0 auto;">
                        <span style="font-size:16px;color:#03457C;">🔒</span>
                        </div>
                        <p style="margin:10px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:600;color:#111827;">Secure by design</p>
                        <p style="margin:4px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.5;">All password resets are encrypted and logged. If you didn't request this, your account remains safe.</p>
                    </div>
                    <div style="flex:1;text-align:center;padding:16px 8px;">
                        <div style="padding: 7px 10px ; border-radius:8px;background-color:#EFF6FF;display:inline-flex;align-items:center;justify-content:center;margin:0 auto;">
                        <span style="font-size:16px;color:#03457C;">⏰</span>
                        </div>
                        <p style="margin:10px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:600;color:#111827;">Expires in 30 min</p>
                        <p style="margin:4px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.5;">For your protection, reset links expire quickly. Request a new one if this expires.</p>
                    </div>
                    <div style="flex:1;text-align:center;padding:16px 8px;">
                        <div style="padding: 7px 10px ; border-radius:8px;background-color:#EFF6FF;display:inline-flex;align-items:center;justify-content:center;margin:0 auto;">
                        <span style="font-size:16px;color:#03457C;">💬</span>
                        </div>
                        <p style="margin:10px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:600;color:#111827;">Need help?</p>
                        <p style="margin:4px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.5;">Contact our support team anytime. We're here to keep your account secure.</p>
                    </div>
                    </div>
                </section>
                <footer style="padding:24px 40px;background-color:#F9FAFB;text-align:center;">
                    <p style="margin:0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#9ca3af;line-height:1.6;">
                    &copy; 2026 VectorPay, Inc. All rights reserved.<br/>
                    VectorPay is a financial technology company, not a bank.
                    </p>
                    <p style="margin:12px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:12px;color:#9ca3af;">
                    <a href="#" style="color:#6b7280;text-decoration:none;">Privacy</a> &nbsp;&bull;&nbsp;
                    <a href="#" style="color:#6b7280;text-decoration:none;">Terms</a> &nbsp;&bull;&nbsp;
                    <a href="#" style="color:#6b7280;text-decoration:none;">Support</a>
                    </p>
                </footer>
                </article>
            </main>
            <!-- Preview text (hidden) -->
            <div style="display:none;max-height:0px;overflow:hidden;">
                Verify your email to start moving money globally with VectorPay.
            </div>
            </body>
        </html>


"""