# SAVERON SOLUTIONS PRIVATE LIMITED website

A premium, responsive, multi-page static website for SAVERON's corporate travel, customised holiday, destination-management, group/MICE and IT service divisions. It uses only HTML5, CSS3 and vanilla JavaScript and can be uploaded to ordinary shared hosting or GitHub Pages.

## Folder structure

```text
/
├── index.html
├── corporate-travel.html
├── holidays.html
├── destinations.html
├── destination-ladakh.html
├── packages.html
├── package-details.html
├── mice-group-travel.html
├── it-solutions.html
├── about.html
├── contact.html
├── privacy-policy.html
├── terms-and-conditions.html
├── cancellation-refund-policy.html
├── payment-policy.html
├── disclaimer.html
├── 404.html
├── css/style.css
├── css/responsive.css
├── js/main.js
├── js/forms.js
├── js/packages.js
├── js/home.js
├── js/destinations.js
├── assets/images/
├── assets/icons/
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

## Run locally

Serve the root folder with any static server. For example, use VS Code Live Server or run `python -m http.server 8000`, then open `http://localhost:8000`. Opening files directly works for most features, but a local server is recommended.

## Upload to hosting

Upload the contents of this folder—not the containing folder—to the public web root (commonly `public_html`). Keep the relative folder structure unchanged. Configure the host's custom 404 setting to `/404.html`, enable HTTPS and verify every form and contact link.

## Common customisation

- Contact details and WhatsApp: update `SITE_CONFIG` at the top of `js/main.js`, then replace the visible bracketed placeholders in HTML.
- Temporary logo: replace the `.brand-logo` contents with an optimised image, preserving the link and accessible text.
- Images: download appropriately licensed images, optimise them to WebP/AVIF, place them in `assets/images/`, and replace the central URLs in `js/home.js`, `js/destinations.js`, and `js/packages.js`. Do not depend on hotlinked development images in production.
- Packages: edit `PACKAGE_DATA` in `js/packages.js`. Preserve each object's `id`, title, destination, duration, category, travelType, hotelCategory, image, description, highlights, inclusions, exclusions, itinerary and customisable fields.
- Forms: set `FORM_ENDPOINT` in `js/forms.js` to a Formspree, Web3Forms or custom API endpoint. For Netlify Forms, add the provider's required form attributes. Test spam protection, validation and the provider's success/failure responses.
- Colours and fonts: edit CSS variables and font declarations near the top of `css/style.css`.
- SEO: revise every page's unique title, description and canonical URL after the final content and domain are confirmed. Update JSON-LD only with verified facts.

## Analytics and Search Console

Do not load analytics until the user grants non-essential consent. After choosing an analytics provider, extend the accepted-cookie branch in `setupCookie()` in `js/main.js` to inject its script only when consent equals `accepted`. Add and verify the property in Google Search Console, submit `https://saveronsolutions.com/sitemap.xml`, and monitor coverage after launch.

Update `sitemap.xml` whenever a public page is added, removed or renamed. Automated sitemap generation can be added in a future build workflow; this static release intentionally has no Node or framework dependency.

## Placeholder replacement list

- `[ADD PHONE NUMBER]`
- `[ADD WHATSAPP NUMBER]`
- `+91XXXXXXXXXX` and `91XXXXXXXXXX`
- `[ADD REGISTERED OFFICE]`
- `[ADD OPERATIONAL OFFICE]`
- `[ADD BUSINESS HOURS]`
- `[ADD CIN]`
- `[ADD GSTIN]`
- `[ADD GOOGLE MAP]`
- `[ADD LINKEDIN URL]`
- `[ADD INSTAGRAM URL]`
- `[ADD FACEBOOK URL]`
- `[ADD YOUTUBE URL]`
- `[ADD FORM ENDPOINT]` / empty `FORM_ENDPOINT`
- `[ADD VERIFIED TESTIMONIAL]`
- `[ADD ACTUAL PACKAGE PRICE]` / `₹XX,XXX`
- `[ADD LEADERSHIP DETAILS]`
- `[ADD VERIFIED CASE STUDY]`
- `[ADD GRIEVANCE CONTACT]`
- Placeholder corporate metrics (`00+`)
- Development image URLs

## Launch checklist

1. Replace every placeholder and all sample testimonials/case studies.
2. Have all legal starter content reviewed by a qualified legal professional.
3. Download, license, optimise and host all images locally; add final Open Graph images and icons.
4. Connect forms and complete live submission tests without storing sensitive data unnecessarily.
5. Verify phone, WhatsApp, email, office, business-hour and active-trip-support wording.
6. Confirm package inclusions, exclusions, prices, tax language and supplier terms.
7. Validate HTML, keyboard navigation, focus order, colour contrast and screen-reader labels.
8. Test at 320, 480, 768, 1024, 1280 and 1440-pixel widths and on physical iOS/Android devices.
9. Run Lighthouse for performance, accessibility, SEO and best practices.
10. Configure HTTPS, security headers, custom 404, backups, analytics consent and Search Console.
11. Crawl the deployed site for broken links and verify `robots.txt`, sitemap and canonicals.

## Recommended next improvements

- Replace remote development imagery with art-directed local responsive images using `srcset`.
- Add verified organisation/address structured data and a bespoke social-sharing image.
- Connect a CRM-aware form endpoint with server-side spam prevention.
- Add a lightweight build check for HTML validation and broken links.
- Add approved destination guides and verified corporate case studies for organic search depth.
