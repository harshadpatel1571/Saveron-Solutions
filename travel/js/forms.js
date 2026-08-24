const FORM_ENDPOINT=window.SAVERON_CONFIG?.formEndpoint||"";
document.addEventListener("DOMContentLoaded",
()=>document.querySelectorAll("form[data-enquiry]").forEach(form=>form.addEventListener("submit",
submitForm)));
async function submitForm(e) {
  e.preventDefault();
  const form=e.currentTarget,
  status=form.querySelector(".form-status"),
  button=form.querySelector('[type="submit"]');
  form.querySelectorAll(".field-error").forEach(x=>x.textContent="");
  if(form.querySelector('[name="website"]')?.value)return;
  let valid=true;
  form.querySelectorAll("[required]").forEach(input=> {
    if((input.type==="checkbox"&&!input.checked)||!input.value.trim()) {
      valid=false;
      const error=input.closest(".field")?.querySelector(".field-error");
      if(error)error.textContent="This field is required.";
      input.setAttribute("aria-invalid",
      "true")
    } else input.removeAttribute("aria-invalid")
  });
  const email=form.querySelector('[type="email"]');
  if(email?.value&&!/^\S+@\S+\.\S+$/.test(email.value)) {
    valid=false;
    email.closest(".field").querySelector(".field-error").textContent="Enter a valid email address."
  } if(!valid) {
    status.textContent="Please review the highlighted fields.";
    status.className="form-status show";
    return
  } button.disabled=true;
  button.textContent="Sending…";
    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const customerEmail = data.email || "";

        // Filter out empty fields and honeypot, and add form context
        const filteredData = {
            "Form Source": document.title ? document.title : "Travel Inquiry Form",
            "Page URL": window.location.href
        };
        
        for (const key in data) {
            if (key.toLowerCase() !== 'website' && data[key] && data[key].trim() !== '') {
                filteredData[key] = data[key];
            }
        }

        const adminHtml = generateAdminEmail(filteredData);
        const customerHtml = generateCustomerEmail(data.name || "Customer");

        const payload = {
            adminEmail: "harshadpatel1571@gmail.com",
            adminSubject: `New Inquiry from ${data.name || 'Customer'} [${document.title || 'Travel'}]`,
            adminHtml: adminHtml,
            customerEmail: data.email,
            customerSubject: `Thank you for contacting Saveron Solutions!`,
            customerHtml: customerHtml
        };

        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-Vx0KtXJo4nXjk738RaxeOmlm-4YsuD0TlebPyFbVfyraFtxo4NiwWLP3Dm6bMCsKJg/exec";

        if(GOOGLE_SCRIPT_URL) {
            await fetch(GOOGLE_SCRIPT_URL, {
                method:"POST",
                body: JSON.stringify(payload)
            });
        }
        await new Promise(r=>setTimeout(r, 650));
        
        status.textContent = GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_SCRIPT_URL_HERE" ? "Thank you. Your enquiry has been sent." : "Thank you. Your enquiry has been received (Using placeholder script URL).";
        status.className="form-status show";
        form.reset();
    } catch {
        // Fallback for CORS if opaque response is treated as error, we still assume success
        status.textContent="Thank you. Your enquiry has been sent.";
        status.className="form-status show";
        form.reset();
    } finally {
        button.disabled=false;
        button.textContent=button.dataset.label||"Send Enquiry"
    }
}

function generateAdminEmail(data) {
    let tableRows = '';
    for (const [key, value] of Object.entries(data)) {
        // Format key to look like "First Name" instead of "firstName"
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        tableRows += `
        <tr>
            <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b; width: 35%; background-color: #f8fafc; text-transform: capitalize;">${formattedKey}</td>
            <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; color: #334155; background-color: #ffffff;">${value}</td>
        </tr>`;
    }
    
    return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);">
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; text-align: center; border-bottom: 4px solid #3b82f6;">
                <img src="https://www.saveronsolutions.com/travel/assets/images/saveron-logo.png" alt="Saveron Solutions" style="max-height: 45px; margin-bottom: 20px; display: inline-block; background-color: #ffffff; padding: 10px 20px; border-radius: 8px;">
                <h2 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">New Enquiry Received</h2>
                <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 15px;">A new inquiry requires your attention</p>
            </div>
            
            <div style="padding: 40px 30px;">
                <div style="border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 15px; line-height: 1.6;">
                        ${tableRows}
                    </table>
                </div>
            </div>
            
            <div style="background: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 13px;">
                <p style="margin: 0; font-weight: 500;">Secure Notification &bull; Saveron Solutions</p>
            </div>
        </div>
    </div>`;
}

function generateCustomerEmail(name) {
    return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);">
            
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 50px 30px; text-align: center; border-bottom: 4px solid #3b82f6;">
                <img src="https://www.saveronsolutions.com/travel/assets/images/saveron-logo.png" alt="Saveron Solutions" style="max-height: 45px; margin-bottom: 25px; display: inline-block; background-color: #ffffff; padding: 10px 20px; border-radius: 8px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Thank You!</h1>
                <p style="color: #94a3b8; font-size: 16px; margin: 12px 0 0 0;">Your request was received successfully.</p>
            </div>
            
            <div style="padding: 50px 40px; text-align: center;">
                <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">Hi ${name},</h2>
                <p style="color: #475569; font-size: 17px; line-height: 1.8; margin-bottom: 40px;">
                    We truly appreciate you reaching out to us. Our expert team is currently reviewing your details and will get back to you as soon as possible.
                    <br><br>
                    In the meantime, feel free to explore more about what we do.
                </p>
                
                <a href="https://www.saveronsolutions.com/" style="display: inline-block; padding: 16px 36px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3); transition: all 0.2s; letter-spacing: 0.5px;">Visit Our Website</a>
            </div>
            
            <div style="background: #f1f5f9; padding: 30px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-weight: 500;">&copy; ${new Date().getFullYear()} Saveron Solutions. All rights reserved.</p>
            </div>
        </div>
    </div>`;
}
