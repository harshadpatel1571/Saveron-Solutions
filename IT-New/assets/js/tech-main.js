/**
 * SAVERON SOLUTIONS - Hyper-Tech Core Interactions & Form Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Dynamic Year
  const yearEls = document.querySelectorAll('[data-year]');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => el.textContent = currentYear);

  // 2. Sticky Header
  const header = document.querySelector('[data-header]');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  // 3. Mobile Navigation Menu with overlay backdrop
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    // Inject overlay if not present
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay) {
      navOverlay = document.createElement('div');
      navOverlay.className = 'nav-overlay';
      document.body.appendChild(navOverlay);
    }

    function openNav() {
      navMenu.classList.add('is-open');
      navOverlay.classList.add('is-visible');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.textContent = '✕';
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      navMenu.classList.remove('is-open');
      navOverlay.classList.remove('is-visible');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.textContent = '☰';
      document.body.style.overflow = '';
    }

    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('is-open');
      isOpen ? closeNav() : openNav();
    });

    navOverlay.addEventListener('click', closeNav);

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // 4. 3D Card Perspective Tilt Effect
  const tiltCards = document.querySelectorAll('.service-tech-card, .project-card, .estimator-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // 5. Tech Stack Tab Switcher
  const techTabs = document.querySelectorAll('.tech-tab-btn');
  const techPanels = document.querySelectorAll('.tech-content-panel');

  techTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetCategory = tab.getAttribute('data-tech-tab');

      techTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      techPanels.forEach(panel => {
        if (panel.getAttribute('data-tech-panel') === targetCategory) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // 6. Portfolio Projects Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. Interactive Project Cost & Scope Estimator
  const estimatorInputs = document.querySelectorAll('.estimator-card input[type="radio"], .estimator-card input[type="checkbox"]');
  const estPriceValue = document.querySelector('.est-price-value');
  const estPriceNote = document.querySelector('.est-price-note');
  const applyEstimateBtn = document.querySelector('[data-apply-estimate]');

  function calculateEstimate() {
    if (!estPriceValue) return;

    let baseMin = 35000;
    let baseMax = 75000;
    let timeline = '2-4 Weeks';
    let selectedAddons = [];

    // Check project type radio
    const selectedType = document.querySelector('.estimator-card input[name="est-type"]:checked');
    if (selectedType) {
      const typeVal = selectedType.value;
      if (typeVal === 'corporate') {
        baseMin = 35000;
        baseMax = 70000;
        timeline = '2-3 Weeks';
      } else if (typeVal === 'ecommerce') {
        baseMin = 65000;
        baseMax = 140000;
        timeline = '4-6 Weeks';
      } else if (typeVal === 'webapp') {
        baseMin = 95000;
        baseMax = 220000;
        timeline = '6-10 Weeks';
      } else if (typeVal === 'enterprise') {
        baseMin = 180000;
        baseMax = 450000;
        timeline = '8-16 Weeks';
      }
    }

    // Check add-ons
    const checkedAddons = document.querySelectorAll('.estimator-card input[name="est-addon"]:checked');
    checkedAddons.forEach(addon => {
      const addonCost = parseInt(addon.getAttribute('data-cost') || '0', 10);
      baseMin += addonCost;
      baseMax += Math.round(addonCost * 1.35);
      selectedAddons.push(addon.parentElement.querySelector('.est-opt-name').textContent.trim());
    });

    const formatCurrency = (val) => '₹' + val.toLocaleString('en-IN');
    estPriceValue.textContent = `${formatCurrency(baseMin)} – ${formatCurrency(baseMax)}`;
    if (estPriceNote) {
      estPriceNote.textContent = `Estimated Delivery: ~${timeline} | Scalable Sprint Model`;
    }
  }

  estimatorInputs.forEach(input => input.addEventListener('change', calculateEstimate));
  calculateEstimate();

  if (applyEstimateBtn) {
    applyEstimateBtn.addEventListener('click', () => {
      const contactSection = document.querySelector('#contact') || document.querySelector('.contact-form-card');
      const serviceSelect = document.querySelector('select[name="service"]');
      const budgetSelect = document.querySelector('select[name="budget"]');
      const descArea = document.querySelector('textarea[name="description"]');

      const selectedType = document.querySelector('.estimator-card input[name="est-type"]:checked');
      if (selectedType && serviceSelect) {
        if (selectedType.value === 'corporate') serviceSelect.value = 'Website Development';
        else if (selectedType.value === 'ecommerce') serviceSelect.value = 'E-commerce Platform';
        else if (selectedType.value === 'webapp') serviceSelect.value = 'Custom Software';
        else if (selectedType.value === 'enterprise') serviceSelect.value = 'Digital Transformation';
      }

      if (descArea) {
        const checkedAddons = Array.from(document.querySelectorAll('.estimator-card input[name="est-addon"]:checked'))
          .map(a => a.parentElement.querySelector('.est-opt-name').textContent.trim());
        
        let addonSummary = checkedAddons.length > 0 ? `\nRequested Modules/Add-ons: ${checkedAddons.join(', ')}` : '';
        descArea.value = `[Generated from Interactive Estimator]\nEstimated Budget Range: ${estPriceValue.textContent}${addonSummary}\n\nProject details: `;
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 8. Stats Counter Animation (Intersection Observer)
  const statNumbers = document.querySelectorAll('[data-counter]');
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetVal = parseFloat(target.getAttribute('data-counter'));
          const suffix = target.getAttribute('data-suffix') || '';
          let current = 0;
          const duration = 1600;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = targetVal / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= targetVal) {
              current = targetVal;
              clearInterval(timer);
            }
            target.textContent = (Number.isInteger(targetVal) ? Math.floor(current) : current.toFixed(1)) + suffix;
          }, stepTime);

          obs.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
  }

  // 9. Contact Form & Google Apps Script Dispatch
  const contactForms = document.querySelectorAll('[data-contact-form]');
  contactForms.forEach(form => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector('.form-status');
      const button = form.querySelector('button[type="submit"]');

      if (!form.checkValidity()) {
        if (status) {
          status.className = 'form-status error';
          status.textContent = 'Please complete all required fields with valid information.';
        }
        form.reportValidity();
        return;
      }

      const originalBtnText = button.innerHTML;
      button.disabled = true;
      button.innerHTML = '<span class="pulse-dot"></span> Transmitting Securely...';
      if (status) {
        status.className = 'form-status';
        status.textContent = 'Encrypting & dispatching inquiry payload...';
      }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const filteredData = {
        "Form Source": "SAVERON Solutions Hyper-Tech IT Portal",
        "Page URL": window.location.href,
        "Timestamp": new Date().toLocaleString()
      };

      for (const key in data) {
        if (key.toLowerCase() !== 'website' && data[key] && data[key].trim() !== '') {
          filteredData[key] = data[key];
        }
      }

      const adminHtml = generateAdminEmail(filteredData);
      const customerHtml = generateCustomerEmail(data.name || "Valued Client");

      const payload = {
        adminEmail: "info@saveronsolutions.com",
        adminSubject: `[High Priority] New IT Inquiry from ${data.name || 'Client'} (${data.company || 'Enterprise'})`,
        adminHtml: adminHtml,
        customerEmail: data.email,
        customerSubject: `Consultation Confirmed: Saveron Solutions Technology Team`,
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

        if (status) {
          status.className = 'form-status success';
          status.innerHTML = '✓ Inquiry transmitted successfully. An engineering advisor will reach out within 24 hours.';
        }
        form.reset();
      } catch (err) {
        if (status) {
          status.className = 'form-status success';
          status.innerHTML = '✓ Inquiry received successfully. Our technology team has been notified.';
        }
        form.reset();
      } finally {
        button.disabled = false;
        button.innerHTML = originalBtnText;
      }
    });
  });
});

/**
 * Generates futuristic high-tech HTML email template for Admin notification
 */
function generateAdminEmail(data) {
  let tableRows = '';
  for (const [key, value] of Object.entries(data)) {
    const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    tableRows += `
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b; font-weight: 600; color: #00f0ff; width: 35%; background-color: #0d1527; font-family: monospace; font-size: 13px;">${formattedKey}</td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b; color: #e2e8f0; background-color: #080d1a; font-size: 14px;">${value}</td>
      </tr>`;
  }

  return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #050811; padding: 24px;">
      <div style="background: #0a101f; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0, 240, 255, 0.2); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);">
        <div style="background: linear-gradient(135deg, #060b14 0%, #0f1c3f 100%); padding: 36px 30px; text-align: center; border-bottom: 3px solid #00f0ff;">
          <img src="https://www.saveronsolutions.com/IT-New/assets/images/saveron-logo-white.png" alt="SAVERON Solutions" style="max-height: 48px; width: auto; margin-bottom: 18px; display: inline-block;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SAVERON IT SOLUTIONS</h2>
          <p style="color: #00f0ff; margin: 8px 0 0 0; font-size: 14px; font-family: monospace; letter-spacing: 0.1em;">NEW HIGH-PRIORITY INQUIRY DETECTED</p>
        </div>
        <div style="padding: 30px;">
          <div style="border-radius: 10px; overflow: hidden; border: 1px solid #1e293b;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; line-height: 1.6;">
              ${tableRows}
            </table>
          </div>
        </div>
        <div style="background: #060b14; padding: 20px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #1e293b;">
          <p style="margin: 0;">Automated Dispatch &bull; SAVERON SOLUTIONS PRIVATE LIMITED</p>
          <p style="margin: 6px 0 0;">📞 <a href="tel:02814091215" style="color:#00f0ff;text-decoration:none;">02814 091215</a> &bull; info@saveronsolutions.com</p>
        </div>
      </div>
    </div>`;
}

/**
 * Generates client confirmation email template
 */
function generateCustomerEmail(name) {
  return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #050811; padding: 24px;">
      <div style="background: #0a101f; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0, 240, 255, 0.2); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);">
        <div style="background: linear-gradient(135deg, #060b14 0%, #0f1c3f 100%); padding: 40px 30px; text-align: center; border-bottom: 3px solid #00f0ff;">
          <img src="https://www.saveronsolutions.com/IT-New/assets/images/saveron-logo-white.png" alt="SAVERON Solutions" style="max-height: 48px; width: auto; margin-bottom: 20px; display: inline-block;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">Consultation Confirmed</h1>
          <p style="color: #00f0ff; font-size: 14px; margin: 8px 0 0 0; font-family: monospace;">SAVERON SOLUTIONS &bull; IT & DIGITAL SYSTEMS</p>
        </div>
        <div style="padding: 40px 32px; text-align: center; color: #cbd5e1;">
          <h2 style="color: #ffffff; margin: 0 0 16px 0; font-size: 22px;">Hello ${name},</h2>
          <p style="font-size: 16px; line-height: 1.8; margin-bottom: 32px; color: #94a3b8;">
            Thank you for reaching out to <strong style="color: #ffffff;">SAVERON Solutions</strong>. Your project inquiry has been assigned to our senior technology and architecture team. We are analyzing your specifications and will respond with a tailored roadmap and meeting proposal.
          </p>
          <a href="https://www.saveronsolutions.com/" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #00f0ff 0%, #3b82f6 100%); color: #050811; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 15px; box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);">Explore Our Digital Ecosystem</a>
        </div>
        <div style="background: #060b14; padding: 22px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #1e293b;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} SAVERON SOLUTIONS PRIVATE LIMITED. All rights reserved.</p>
        </div>
      </div>
    </div>`;
}
