# SEO Preservation Plan

Audit date: 26 July 2026
Audited URL: `https://synergi.ae/`
Method: rendered desktop DOM, metadata, structured data, link, heading, image, and computed-style inspection.

## Executive safeguard

The redesign is a presentation change, not a search-strategy change. The production migration must retain the live URL, primary intent, H1, important regional copy, service copy, internal links, metadata, canonical, and structured-data ownership.

The prototype deliberately keeps keyword-focused content in the initial HTML. JavaScript only changes visual state. Core service and benefits content is not requested from an API after page load.

The particle canvas is a decorative progressive enhancement rather than a replacement for indexable copy. All four Synergi figures remain native button text in the server HTML, and the interaction does not fetch or generate business content.

## Existing metadata inventory

| Element | Current value | Prototype handling |
|---|---|---|
| Title | `BPO Services in UAE & the Gulf \| Synergi Business Solutions` | Preserved exactly |
| Meta description | `Synergi provides tailored BPO services in UAE & the Gulf, offering customer support, HR, & finance outsourcing solutions to help businesses...` | Preserved exactly |
| Canonical | `https://synergi.ae/` | Preserved exactly |
| Language | `en-US` | Preserved as English document language |
| Current H1 | `BPO Services in UAE & the Gulf to Power Your Business` | Preserved exactly; one H1 only |
| Website name in schema | `Synergi BPO` | Preserved |
| Website description in schema | `Business Process Outsourcing UAE` | Preserved |
| Organization name | `Synergi BPO` | Preserved |

The existing meta description ends with an ellipsis and may be truncated or intentionally shortened. Do not rewrite it as part of the visual migration. A separate search-snippet review can be approved later.

## Existing heading inventory

### H1

1. BPO Services in UAE & the Gulf to Power Your Business

### H2

1. Our Core BPO Services:
2. The Synergi Executive Podcast
3. Why Choose Synergi for BPO in UAE and the Gulf
4. Industries We Serve in UAE and the Gulf
5. Benefits of Outsourcing with Synergi
6. Transform Your Business with Shared Services
7. Get Started with Synergi Today

### H4 article headings

The homepage’s slider/carousel duplicates these article headings in the rendered DOM:

1. The power of automating your HR operations
2. The New PIF Strategy 2026-2030 & Business Opportunities in KSA
3. Why Odoo is the right technology to empower your business
4. The Hidden Cost of Poor Inventory Data: Why Technology Alone Won’t Transform Your Supply Chain
5. The future of BPO in Syria and why it is an enabler of economic transformation
6. Fractional C-Level Executives: Strategic Leadership Without the Overhead

### Other current heading behavior

The Industries introduction is currently an H6. The whole Industries container has all three responsive hide classes applied simultaneously, even though its text remains in the DOM. This is a usability and potentially an SEO-quality problem. The redesign makes the section visible and uses normal H2/H3 hierarchy.

## Proposed heading structure

The production page should use:

- H1: BPO Services in UAE & the Gulf to Power Your Business
- H2: What does your business need next?
  - H3: One heading for each goal panel
- H2: Our Core BPO Services
  - H3: Five service-card titles
- H2: Regional context. Enterprise discipline.
  - H3: Why Choose Synergi for BPO in UAE and the Gulf
- H2: Industries We Serve in UAE and the Gulf
  - H3: Five industry names
- H2: Conversations for people who run businesses.
- H2: Transform Your Business with Shared Services
  - H3: Connected support across Gulf markets
- H2: Local understanding. Connected reach.
- H2: Technology and expertise, connected.
- H2: Ideas for operators and decision-makers.
  - H3: Three current article titles
- H2: Make the business simpler to run.

Footer column headings may remain H2 because the footer is a separate landmark. They must not replace the visible page hierarchy.

## Existing paragraph and list inventory

### Opening regional BPO copy

> At Synergi, we deliver reliable BPO services in UAE and the Gulf, helping companies streamline operations, cut costs, and focus on growth. From business outsourcing in UAE and across the Gulf to specialized back-office services and customer support outsourcing, we provide solutions tailored to your business needs. Whether you are a startup in Dubai, a growing company in Doha, or an established enterprise in Riyadh, Synergi ensures efficiency and scalability across the region.

**Handling:** The hero uses a concise visible summary so the complete interaction fits within the initial viewport. The full original paragraph remains visible in the Shared Services SEO section.

### Core service lists

**Procurement**

- Source to Contract
- Governance and Compliance
- Procurement administration
- Spend Analytics
- Contract administration and negotiation
- Category management

**Technology & AI**

- Service desk and end user support
- On-premises & cloud managament
- Regulatory compliance
- Procurement support
- SAP Managed services
- Collaboration tooling

**Marketing**

- Marketing strategy
- Social Media management
- Events management
- Brand development & management
- PR Representation
- Customer Experience standards (with the ICXI)
- Fractional “Chief Marketing Officer” (CMO)

**Accounting**

- Bookkeeping VAT & Tax
- Record to Report
- Order to Cash
- Procure to Pay
- Financial Planning & Analysis
- Analytics and Reporting

**Human Resources**

- Hire to Retire
- Payroll and Pension
- Performance Management
- Organizational Development
- Learning & Development
- HRMS implementation
- Manpower augmentation
- CXO as a service

**Handling:** Every item remains in the initial HTML inside the five carousel cards. The prototype corrects the visible spelling of “managament” to “management”; obtain editorial approval before production.

### Expertise and impact copy

Current source:

> Our in-depth understanding of these sectors ensures we stay at the forefront of industry trends. This positions us as the compass, offering clarity and direction, leading you clearly amid business challenges. Our expert teams tap into the exceptional abilities of local talent, consistently raising the bar of excellence in every endeavor.

Current source:

> Synergi transforms intricate challenges into actionable growth strategies. Whether refining efficient workflows, introducing ground-breaking technological tools, or building robust systems, our mission is to identify and overcome the barriers holding your enterprise back. We create tailored solutions to fit your specific needs, helping you succeed. We set a varied growth plan for your business using advanced technology and detailed data. By aligning seamlessly with your objectives, we ensure that your focus remains undistracted – on your core business.

**Handling:** The current visual iteration replaces the former Impact treatment with the supplied Synergi figures. Before production, confirm whether these two source paragraphs should remain elsewhere on the page for content continuity.

### Podcast copy

Current homepage:

> A BPO-led platform exploring how leadership, strategy, and operations drive real business impact across the MENA region.

Verified current Podcast page:

> Synergi’s Executive Podcast Series is a BPO-led platform exploring how leadership, strategy, and operations align to drive meaningful business impact across the MENA region.

**Handling:** The homepage sentence is preserved, with verified supporting copy from the Podcast page. No episode title is invented.

### Why Choose Synergi copy

> Synergi is more than just an outsourcing provider, we are a trusted partner across the Gulf. By combining international standards with regional expertise, we guarantee that your business processes are secure, efficient, and fully compliant.

Key reasons:

- Experience across multiple Gulf markets
- Customized outsourcing strategies
- Compliance with UAE and Gulf regulations
- Flexible operations that grow with your business

**Handling:** Preserved visibly.

### Industries content

> Synergi provides BPO services in UAE and Gulf countries for:

- Banking & Finance: Payroll outsourcing, compliance, and secure data handling
- Healthcare: Patient support, medical record management, and billing services
- Retail & E-Commerce: Customer care, order management, and returns handling
- Technology & Startups: IT support, SaaS customer service, and scaling solutions
- Real Estate & Construction: Lead generation, document processing, and back-office support

> By serving multiple industries across the UAE and Gulf, we adapt our outsourcing services to each market’s unique requirements.

**Handling:** Preserved and visible at every breakpoint.

### Benefits of outsourcing

> Choosing Synergi for your BPO services in UAE and the Gulf offers clear advantages:

- Cost Savings: Reduce overhead and operational expenses
- Regional Reach: One partner for UAE and wider Gulf markets
- Access to Expertise: Skilled teams ready to serve across industries
- Scalable Services: Flexible solutions that expand as your business grows
- Focus on Core Activities: Let your teams focus on strategy while we handle operations

**Handling:** Preserved in a native disclosure. Content is in the initial HTML and does not depend on JavaScript.

### Shared Services content

> Centralize and streamline your back-office functions with our Shared Services in UAE, Dubai, and across the GCC. From HR and Finance to Procurement in UAE, we help you cut costs, boost compliance, and scale faster.

**Handling:** Preserved visibly with the Procurement and Shared Services links.

### Saudi Arabia BPO content

> Looking to optimize operations beyond shared services? Discover our BPO Services in Saudi Arabia (KSA & Riyadh), tailored to help businesses streamline workflows, enhance performance, and achieve sustainable growth across the Gulf region.

**Handling:** Preserved visibly with the exact destination URL.

### Closing conversion copy

> If your company is looking for reliable BPO services in UAE and the Gulf, Synergi is your partner for growth. From customer support outsourcing to HR, finance, and IT services, we deliver tailored solutions that boost efficiency and performance. Contact Synergi today to explore outsourcing solutions across the UAE and Gulf.

**Handling:** Preserved in the final CTA, with the final sentence represented by the Contact CTA.

## Internal-link inventory

All meaningful current homepage internal destinations:

| Anchor purpose | URL |
|---|---|
| Home | `https://synergi.ae/` |
| About Us | `https://synergi.ae/about-us/` |
| Global Locations | `https://synergi.ae/global-locations/` |
| Our Approach | `https://synergi.ae/our-approach/` |
| Our Services | `https://synergi.ae/our-services/` |
| Engagement Team | `https://synergi.ae/engagement-team/` |
| Media | `https://synergi.ae/media/` |
| Contact Us | `https://synergi.ae/contact-us/` |
| Podcast | `https://synergi.ae/executive-podcast/` |
| Podcast legacy/homepage CTA currently observed | `https://synergi.ae/synergi-executive-podcast/` |
| Our Blog | `https://synergi.ae/blog/` |
| Human Resources | `https://synergi.ae/our-services/human-resources/` |
| Technology & AI | `https://synergi.ae/our-services/technology-ai/` |
| Accounting | `https://synergi.ae/our-services/accounting/` |
| Marketing | `https://synergi.ae/our-services/marketing/` |
| Procurement | `https://synergi.ae/our-services/procurement/` |
| Shared Services | `https://synergi.ae/shared-services-uae/` |
| BPO Services in Saudi Arabia | `https://synergi.ae/bpo-services-in-saudi-arabia-ksa-riyadh/` |
| HR automation article | `https://synergi.ae/automating-hr-operations/` |
| PIF Strategy article | `https://synergi.ae/pif-strategy-2026-2030-business-opportunities-ksa/` |
| Odoo article | `https://synergi.ae/odoo-erp-gcc-businesses/` |
| Inventory data article | `https://synergi.ae/poor-inventory-data-hidden-supply-chain-cost/` |
| Syria BPO article | `https://synergi.ae/bpo-in-syria-economic-transformation/` |
| Fractional leadership article | `https://synergi.ae/fractional-c-level-executives-middle-east/` |
| Terms | `https://synergi.ae/terms/` |
| Privacy Policy | `https://synergi.ae/privacy-policy/` |

The redesign standardizes the Podcast destination to `/executive-podcast/`, which is the current main navigation destination and verified page. Before production, inspect whether `/synergi-executive-podcast/` redirects correctly. Do not remove that URL or change its redirect without verification.

## Partner-link inventory

| Partner | URL |
|---|---|
| innovawave | `https://innovawave.com/` |
| Pemo | `https://www.pemo.io/` |
| Teradix | `https://teradix.com/` |
| Lexzur | `https://www.lexzur.com/` |
| Odoo | `https://www.odoo.com/` |
| International Customer Experience Institute | `https://icxi.com/` |
| SAP | `https://www.sap.com/` |
| Menaitech | `https://menaitech.com/` |
| Zoho | `https://www.zoho.com/` |

Use `rel="noopener"` for links opened in a new tab. Do not add `nofollow` unless the SEO owner has a policy reason.

## Social-link inventory

- LinkedIn: `https://www.linkedin.com/company/synergi-ae/`
- Instagram: `https://www.instagram.com/synergi.ae/`
- Facebook: `https://www.facebook.com/profile.php?id=61553776125146`
- YouTube: `https://www.youtube.com/@SynergiAE`

## Current image-alt audit

The rendered homepage contains 63 image elements, including duplicated slider/partner/article items and feed content. Many logo and decorative images currently have empty alt text. Unique meaningful values observed:

| Current alt text | Notes / action |
|---|---|
| `BPO Services in UAE \| Synergi Business Solutions` | Current hero background. Preserve intent if a meaningful hero image returns. |
| `line` | Decorative. Change to empty alt in production. |
| `Synergi Executive Podcast Series` | Preserved. |
| `Synergi BPO services in UAE team at work` | Existing supporting image. Not reused in prototype. |
| `HR automation and BPO digital dashboard for GCC workforce operations` | Preserved on article card. |
| `PIF Strategy 2026-2030 business opportunities in KSA` | Preserved on article card. |
| `Synergi - Odoo Mazen` | Current source value. Improve only with editorial approval if that post is featured. |
| `Frustrated inventory manager reviewing product data on a laptop in a modern office.` | Preserved with punctuation normalized. |
| `Damascus Umayyad Square with the Syrian flag and subtle digital network lines representing BPO growth, service exports, and economic transformation in Syria.` | Current article alt; article is not among the prototype’s featured three. |
| `Fractional C-level executives discussing business strategy in a modern Middle East boardroom` | Current article alt; article is not among the prototype’s featured three. |
| `Benefits of our BPO Services in UAE` | Current benefits image. Not reused; editorial content remains text. |
| Four long Instagram captions used as image alt values | These begin “Round-the-clock support…”, “White glove service…”, “Cost center or value driver?”, and “Office Chair - Black.” Avoid using full captions as alt text in production; use concise descriptions or treat decorative thumbnails as empty alt with adjacent visible text. |
| `Lightbox image placeholder` | Plugin placeholder. Do not carry into new visible content. |

Current partner logo images generally have empty alt attributes. The prototype assigns concise partner-name logo alt text. Decorative SVG pathways use empty alt text and `aria-hidden="true"`.

## Structured-data inventory and recommendations

Current Yoast-style JSON-LD includes:

- `WebPage`
- `ImageObject` for the primary image
- `BreadcrumbList`
- `WebSite`
- `Organization`
- `SearchAction`
- Organization `sameAs` links for LinkedIn and Instagram

Production recommendations:

1. Continue letting the existing SEO plugin own WebPage, WebSite, Organization, breadcrumb, canonical, and search schema.
2. Do not paste the prototype JSON-LD into Elementor if the SEO plugin is active; that would duplicate entities.
3. Keep the Organization name, logo, URL, and social profiles consistent.
4. Review the primary image after the hero is approved.
5. Add `PodcastSeries` or `PodcastEpisode` schema only on the relevant podcast templates and only when complete, verified data is available.
6. Do not add fake FAQ schema. The guided journey and service disclosures are not automatically FAQs.
7. Verify schema after migration with Google Rich Results Test and Schema.org Validator.

## Carousel, disclosure, and tab indexability

- All five core service cards/lists and the benefits disclosure are present in the original HTML.
- Native `<details>` is acceptable for progressively disclosed content.
- Carousel and Elementor tab/disclosure output must be checked in page source, not only the browser inspector.
- Do not fetch SEO copy after click.
- Do not apply responsive hide classes to keyword content.
- Do not use `display:none` on large keyword blocks as an SEO technique. Closed disclosure presentation is acceptable only when the content is user-accessible and present in source.
- The guided-journey panels are supplementary and do not replace the visible service sections.

## JavaScript-rendering considerations

- Navigation and all primary content work without JavaScript.
- JavaScript updates the hero service summary but every service has a visible destination and the full lists are rendered later.
- JavaScript changes the layered position of the service cards and manages inactive-card focus. Without JavaScript, all five cards render as a normal vertical grid.
- JavaScript coordinates which business-goal panel is visually active; all panels exist in HTML.
- Scroll reveal must never leave content transparent when the observer is unavailable or reduced motion is enabled.
- Production caching/minification must not delay the script in a way that traps content at opacity zero.

## URL and redirect warnings

- Keep the homepage at `/`.
- Keep all current service, blog, location, policy, and contact slugs.
- Rebuilding with Elementor does not justify URL changes.
- Verify the two observed Podcast URLs and maintain a single canonical destination with a proper permanent redirect if required.
- Do not create new “pretty” versions of current URLs without a redirect map and SEO approval.
- Do not redirect retired article URLs to the homepage; retain articles or redirect to the closest equivalent.

## Metadata recommendations

For the visual migration:

- Keep the current title and description.
- Keep the canonical self-referencing.
- Keep `en-US` unless the language strategy changes.
- Update Open Graph image only after the final approved hero/social image is ready.
- Do not add `noindex` to the live page.
- Keep staging password-protected or noindexed, then confirm the directive is absent from production.

## Regional keyword preservation

The prototype visibly retains:

- UAE
- Gulf
- GCC
- Dubai
- Abu Dhabi
- Doha
- Qatar
- Riyadh
- Saudi Arabia
- KSA
- MENA

Beirut/Lebanon and Bucharest/Romania are used only in the Regional Presence section because they are confirmed on the current Global Locations page. No office location or address is invented.

## Pre-replacement checklist

- [ ] Back up the current homepage template and SEO plugin settings.
- [ ] Keep the live homepage URL.
- [ ] Confirm one exact H1.
- [ ] Confirm the title, meta description, canonical, and language.
- [ ] Confirm all current high-value internal links.
- [ ] Confirm service lists appear in page source.
- [ ] Confirm the Industries section is visible at desktop, tablet, and mobile.
- [ ] Confirm Shared Services, Procurement in UAE, and KSA/Riyadh BPO copy is visible.
- [ ] Confirm the closing UAE/Gulf conversion copy.
- [ ] Confirm partner and social links.
- [ ] Confirm alt text and decorative empty alts.
- [ ] Confirm responsive image dimensions and no layout shift.
- [ ] Confirm current SEO plugin schema and no duplicate hard-coded JSON-LD.
- [ ] Verify the Podcast URL/redirect.
- [ ] Check robots meta and HTTP `X-Robots-Tag`.
- [ ] Check sitemap inclusion.
- [ ] Check page source with JavaScript disabled.
- [ ] Crawl the staging page and compare link/headline/content counts.
- [ ] Run Lighthouse and Core Web Vitals checks.
- [ ] Run keyboard and screen-reader smoke tests.
- [ ] Run Rich Results Test and Schema.org validation.
- [ ] Monitor Search Console coverage, rankings, and crawl activity after launch.
