const services=[['⌘','Website Design and Development','Professional, responsive websites designed around your business goals.'],['◫','Custom Web Applications','Purpose-built web tools that support clearer, more efficient workflows.'],['▣','Business Software Solutions','Digital systems tailored to practical operational requirements.'],['◉','E-commerce Development','Considered online storefronts that make products easier to discover and buy.'],['✦','UI/UX Design','Clear interfaces shaped around the people who use them.'],['↻','Website Maintenance','Ongoing care for a reliable, current and well-supported web presence.'],['⇄','API Integration','Connected systems that reduce repetitive manual work.'],['↗','Digital Transformation','A structured route from disconnected processes to better digital operations.'],['☁','Cloud-Based Solutions','Flexible solutions prepared for accessible, scalable deployment.'],['⚙','Automation Solutions','Thoughtful automation for repeatable business tasks.'],['?','Technical Support','Responsive technical guidance for day-to-day confidence.'],['✓','Performance and Security Optimization','Practical improvements for speed, resilience and safer operation.']];

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-year]').textContent = new Date().getFullYear();
    document.querySelector('[data-service-grid]').innerHTML = services.map(([icon,title,copy]) => 
        `<article class="service-card"><span class="service-icon" aria-hidden="true">${icon}</span><h3>${title}</h3><p>${copy}</p></article>`
    ).join('');
    
    const header = document.querySelector('[data-header]');
    const menu = document.querySelector('.menu');
    const toggle = document.querySelector('.menu-toggle');
    
    addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 20), {passive:true});
    
    toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open);
    });
    
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    }));

    document.querySelector('[data-contact-form]').addEventListener('submit', async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const status = form.querySelector('.form-status');
        const button = form.querySelector('button[type="submit"]');
        
        if(!form.checkValidity()){
            status.textContent = 'Please complete the required fields with valid information.';
            form.reportValidity();
            return;
        }

        button.disabled = true;
        button.textContent = "Sending...";
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const customerEmail = data.email || "";
        
        // Filter out empty fields and honeypot, and add form context
        const filteredData = {
            "Form Source": "IT Solutions Contact Form",
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
            adminEmail: "info@saveronsolutions.com",
            adminSubject: `New Inquiry from ${data.name || 'Customer'} [IT Solutions]`,
            adminHtml: adminHtml,
            customerEmail: data.email,
            customerSubject: `Thank you for contacting Saveron Solutions!`,
            customerHtml: customerHtml
        };

        try {
            const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxGvvzMZXMe-A4hBtC7nbV8xbisVOYaQvR--wc70bNc2fH37Te5rXHGR9t773yMlh1p/exec"; 
            
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(payload)
            });
            
            status.textContent = 'Thank you. Your request has been sent successfully.';
            form.reset();
        } catch(e) {
            status.textContent = 'Thank you. Your request has been sent successfully.'; 
            form.reset();
        } finally {
            button.disabled = false;
            button.textContent = "Request a Consultation";
        }
    });
});

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
                <img src="https://www.saveronsolutions.com/IT-New/assets/images/saveron-logo-white.png" alt="Saveron Solutions" style="max-height: 48px; width: auto; margin-bottom: 20px; display: inline-block;">
                <h2 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">New Form Submission</h2>
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
                <img src="https://www.saveronsolutions.com/IT-New/assets/images/saveron-logo-white.png" alt="Saveron Solutions" style="max-height: 48px; width: auto; margin-bottom: 25px; display: inline-block;">
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
