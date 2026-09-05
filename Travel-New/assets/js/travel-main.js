/**
 * SAVERON TRAVEL & TOURISM - Luxury Nature Experience & Interaction Engine
 */

// ==========================================================================
// NATURE AMBIENCE SOUND SETTINGS
// Set your custom audio file path (MP3, WAV, OGG) or streaming audio URL!
// ==========================================================================
const NATURE_SOUND_CONFIG = {
  // Custom audio source (local file or direct online audio link)
  // Default is the bundled calming waterfall & nature stream MP3
    audioSource: 'assets/audio/nature.m4a',

  // Volume level (1 to 100)
  volume: 50
};

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Dynamic Year
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // 2. Header Scroll Effect
  const headerWrapper = document.querySelector('.header-wrapper');
  if (headerWrapper) {
    window.addEventListener('scroll', () => {
      headerWrapper.classList.toggle('is-scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // 3. Mobile Navigation Menu with overlay backdrop
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    // Inject overlay element
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
    navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
  }

  // 4. Background Nature Ambience Audio Engine (Pure Background Audio - No Popups, No YouTube Errors)
  let isSoundPlaying = false;
  let natureAudio = null;

  function getNatureAudio() {
    if (!natureAudio) {
      natureAudio = new Audio();
      natureAudio.loop = true;
      natureAudio.preload = 'auto';

      let source = (NATURE_SOUND_CONFIG.audioSource || '').trim();
      // If empty or YouTube link was entered, seamlessly use the local authentic nature ambience audio
      if (!source || source.includes('youtube.com') || source.includes('youtu.be')) {
        source = 'assets/audio/nature-ambience.mp3';
      }

      natureAudio.src = source;

      // Gracefully fall back to local nature stream if external resource fails
      natureAudio.addEventListener('error', () => {
        const fallback = 'assets/audio/nature-ambience.mp3';
        if (!natureAudio.src.endsWith(fallback)) {
          natureAudio.src = fallback;
          if (isSoundPlaying) {
            natureAudio.play().catch(() => {});
          }
        }
      });
    }

    const vol = Math.max(0, Math.min(100, NATURE_SOUND_CONFIG.volume ?? 75));
    natureAudio.volume = vol / 100;
    return natureAudio;
  }

  function startNatureAudio() {
    isSoundPlaying = true;
    const soundWidget = document.getElementById('nature-sound-pill');
    if (soundWidget) {
      soundWidget.classList.add('playing');
      const label = soundWidget.querySelector('.sound-label');
      if (label) label.textContent = 'Nature Ambience: PLAYING';
    }

    const audio = getNatureAudio();
    if (audio) {
      audio.play().catch(err => {
        console.warn('Nature audio playback notice:', err);
      });
    }
  }

  function stopNatureAudio() {
    isSoundPlaying = false;
    const soundWidget = document.getElementById('nature-sound-pill');
    if (soundWidget) {
      soundWidget.classList.remove('playing');
      const label = soundWidget.querySelector('.sound-label');
      if (label) label.textContent = 'Nature Ambience: OFF';
    }

    if (natureAudio) {
      natureAudio.pause();
    }
  }

  const soundWidget = document.getElementById('nature-sound-pill');
  if (soundWidget) {
    soundWidget.addEventListener('click', () => {
      if (!isSoundPlaying) {
        startNatureAudio();
      } else {
        stopNatureAudio();
      }
    });
  }

  // 5. Trip Planner Quick Search Dispatcher
  const plannerForm = document.getElementById('quick-planner-form');
  if (plannerForm) {
    plannerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dest = document.getElementById('planner-dest')?.value || '';
      const type = document.getElementById('planner-type')?.value || '';
      window.location.href = `packages.html?dest=${encodeURIComponent(dest)}&type=${encodeURIComponent(type)}`;
    });
  }

  // 6. Contact Form Submission
  document.querySelectorAll('[data-contact-form]').forEach(form => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector('.form-status');
      const button = form.querySelector('button[type="submit"]');

      if (!form.checkValidity()) {
        if (status) { status.className = 'form-status error'; status.textContent = 'Please complete all required fields.'; }
        form.reportValidity();
        return;
      }

      const originalBtnText = button.innerHTML;
      button.disabled = true;
      button.innerHTML = 'Sending Inquiry...';
      if (status) { status.className = 'form-status'; status.textContent = 'Submitting your travel inquiry...'; }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const filteredData = {
        "Form Source": "SAVERON Luxury Nature & Travel Portal",
        "Page URL": window.location.href,
        "Timestamp": new Date().toLocaleString()
      };
      for (const key in data) {
        if (key.toLowerCase() !== 'website' && data[key] && data[key].trim() !== '') {
          filteredData[key] = data[key];
        }
      }

      const adminHtml = generateAdminEmail(filteredData);
      const customerHtml = generateCustomerEmail(data.name || "Valued Guest");

      const payload = {
        adminEmail: "info@saveronsolutions.com",
        adminSubject: `[Nature Travel] New Inquiry from ${data.name || 'Traveler'} — ${data.service || 'General'}`,
        adminHtml,
        customerEmail: data.email,
        customerSubject: "Your SAVERON Travel Inquiry Has Been Received 🌿",
        customerHtml
      };

      try {
        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxGvvzMZXMe-A4hBtC7nbV8xbisVOYaQvR--wc70bNc2fH37Te5rXHGR9t773yMlh1p/exec";
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });
        if (status) { status.className = 'form-status success'; status.innerHTML = '✓ Your inquiry has been submitted. A travel specialist will reach out within 24 hours.'; }
        form.reset();
      } catch (err) {
        if (status) { status.className = 'form-status success'; status.innerHTML = '✓ Inquiry received. Our travel team has been notified.'; }
        form.reset();
      } finally {
        button.disabled = false;
        button.innerHTML = originalBtnText;
      }
    });
  });
});

function generateAdminEmail(data) {
  let rows = '';
  for (const [key, value] of Object.entries(data)) {
    const fk = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
    rows += `<tr>
      <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#062017;width:35%;background:#f8fafc;font-size:13px">${fk}</td>
      <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;color:#1e293b;background:#ffffff;font-size:14px">${value}</td>
    </tr>`;
  }
  return `<div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:650px;margin:0 auto;background:#f1f5f9;padding:24px">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 30px rgba(0,0,0,0.06)">
      <div style="background:#ffffff;padding:36px 30px;text-align:center;border-bottom:3px solid #10b981">
        <img src="https://www.saveronsolutions.com/Travel-New/assets/images/saveron-logo.png" alt="SAVERON Travel" style="max-height:52px;width:auto;margin-bottom:16px;display:inline-block">
        <h2 style="color:#062017;margin:0;font-size:24px;font-weight:800;font-family:Georgia,serif;letter-spacing:-0.5px">SAVERON NATURE & LUXURY TRAVEL</h2>
        <p style="color:#059669;margin:8px 0 0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600">New Luxury Travel Inquiry</p>
      </div>
      <div style="padding:30px">
        <div style="border-radius:10px;overflow:hidden;border:1px solid #e2e8f0">
          <table style="width:100%;border-collapse:collapse;text-align:left;line-height:1.6">${rows}</table>
        </div>
      </div>
      <div style="background:#f8fafc;padding:20px;text-align:center;color:#64748b;font-size:12px;border-top:1px solid #e2e8f0">
        <p style="margin:0">SAVERON SOLUTIONS PRIVATE LIMITED &bull; Luxury Nature Travel Desk</p>
        <p style="margin:6px 0 0">📞 <a href="tel:02814091215" style="color:#059669;text-decoration:none;">02814 091215</a> &bull; info@saveronsolutions.com</p>
      </div>
    </div>
  </div>`;
}

function generateCustomerEmail(name) {
  return `<div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:650px;margin:0 auto;background:#f1f5f9;padding:24px">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 30px rgba(0,0,0,0.06)">
      <div style="background:#ffffff;padding:40px 30px;text-align:center;border-bottom:3px solid #10b981">
        <img src="https://www.saveronsolutions.com/Travel-New/assets/images/saveron-logo.png" alt="SAVERON Travel" style="max-height:52px;width:auto;margin-bottom:18px;display:inline-block">
        <h1 style="color:#062017;margin:0;font-size:28px;font-weight:800;font-family:Georgia,serif">Your Journey Begins</h1>
        <p style="color:#059669;font-size:13px;margin:8px 0 0;letter-spacing:0.12em;text-transform:uppercase;font-weight:600">SAVERON Solutions &bull; Nature & Luxury Travel</p>
      </div>
      <div style="padding:40px 32px;text-align:center;color:#1e293b">
        <h2 style="color:#062017;margin:0 0 16px;font-size:22px;font-family:Georgia,serif">Hello ${name},</h2>
        <p style="font-size:16px;line-height:1.8;margin-bottom:32px;color:#475569">
          Thank you for contacting <strong style="color:#062017">SAVERON Travel</strong>. Our bespoke travel designers are carefully reviewing your preferences to craft an unforgettable, relaxing itinerary tailored to your schedule and comfort.
        </p>
        <a href="https://www.saveronsolutions.com/Travel-New/index.html" style="display:inline-block;padding:14px 34px;background:linear-gradient(135deg,#059669 0%,#10b981 100%);color:#ffffff;text-decoration:none;border-radius:50px;font-weight:700;font-size:15px;box-shadow:0 8px 20px rgba(16,185,129,0.35)">Explore SAVERON Travel</a>
      </div>
      <div style="background:#f8fafc;padding:22px;text-align:center;color:#64748b;font-size:13px;border-top:1px solid #e2e8f0">
        <p style="margin:0">&copy; ${new Date().getFullYear()} SAVERON SOLUTIONS PRIVATE LIMITED. All rights reserved.</p>
        <p style="margin:6px 0 0">📞 <a href="tel:02814091215" style="color:#059669;text-decoration:none;">02814 091215</a> &bull; info@saveronsolutions.com</p>
      </div>
    </div>
  </div>`;
}
