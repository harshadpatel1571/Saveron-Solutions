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
    if(FORM_ENDPOINT)await fetch(FORM_ENDPOINT,
   {
      method:"POST",
      body:new FormData(form),
      headers: {
        Accept:"application/json"
      }
    });
    await new Promise(r=>setTimeout(r,
    650));
    status.textContent=FORM_ENDPOINT?"Thank you. Your enquiry has been sent.":"Thank you. Your enquiry has been received in this demonstration. Connect a form endpoint before launching the website.";
    status.className="form-status show";
    form.reset()
  } catch {
    status.textContent="We could not submit your enquiry. Please email us directly.";
    status.className="form-status show"
  } finally {
    button.disabled=false;
    button.textContent=button.dataset.label||"Send Enquiry"
  }
}
