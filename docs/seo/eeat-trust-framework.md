# E-E-A-T Trust Signals & Editorial Integrity Framework

This document outlines the Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) infrastructure implemented across **Age & Date Calculator** (`agecalc`) in **English (`en`)**, **Spanish (`es`)**, and **Brazilian Portuguese (`pt-BR`)**.

---

## 1. Experience & Expertise (Chronometry & Mathematics)

### 1.1 Dedicated Editorial & Engineering Byline
Every editorial guide, methodology page, and tool explanation carries a visible author/reviewer attribution:
- **English:** `Reviewed by: Chronometry & Technical Editorial Desk`
- **Spanish:** `Revisado por: Equipo Editorial de Cronometría y Derecho Aplicado`
- **Portuguese:** `Revisado por: Bancada Técnica de Cronometria e Normas Aplicadas`

### 1.2 "Last Updated" Verification Timestamps
Every content article and tool documentation page renders an explicit `<time datetime="YYYY-MM-DD">` metadata stamp to signal freshness and ongoing accuracy audits.

### 1.3 Dedicated Methodology Pages
Located at `/methodology/`, `/es/methodology/`, and `/pt/methodology/`, these pages thoroughly document:
1. **Discrete Gregorian Borrow Algorithm:** Explaining why naive decimal divisions ($365.25$ or $30.4375$) cause costly errors in statutory age determination, and demonstrating the exact integer borrow algorithm for months preceding target dates.
2. **Leap Century Boundary Exceptions:** Clarifying the 400-year Gregorian cycle (e.g. why 2000 was a leap year, but 1900 and 2100 are common years).
3. **DST-Neutral UTC Day Math:** Explaining why all duration and day counters convert to UTC midnight timestamps (`Date.UTC(y, m-1, d)`), eliminating 23-hour and 25-hour Daylight Saving Time skew.

---

## 2. Authoritativeness & Official Legal Citations

To maintain absolute credibility and strictly avoid unverified statutory assertions, all regional and legal use cases link directly to authoritative government and scientific bodies:

### 2.1 English Market (US, India, Commonwealth)
- **Competitive Civil Service & Exam Cutoffs:**
  - Explains the concept of "Age as on a Cutoff Date" without hardcoding arbitrary limits.
  - Links to official examination portals:
    - Union Public Service Commission: [upsc.gov.in](https://upsc.gov.in)
    - Staff Selection Commission: [ssc.gov.in](https://ssc.gov.in)
    - US Office of Personnel Management: [opm.gov](https://www.opm.gov)
- **Astronomical & Lunar References:**
  - U.S. Naval Observatory (USNO) Astronomical Applications Department.
  - Hong Kong Observatory (HKO) Gregorian-Lunar ephemeris tables (1901–2100).

### 2.2 Spanish Market (Neutral Latin American & Spain)
- **Administrative Deadlines & Document Renewals:**
  - Outlines age-based renewal tiers for identification documents (*cédula de identidad, DNI, pasaporte*) without stating unverified statutory ages.
  - Links to official government citizen portals:
    - Portal Oficial del Gobierno de México: [gob.mx](https://www.gob.mx)
    - Portal del Estado Colombiano: [gov.co](https://www.gov.co)
- **Civil Code Majority Provisions:**
  - Explains the civil majority counting rule (e.g. Article 315 of the Código Civil and Latin American counterparts), noting that the birthday is included in the year tally.

### 2.3 Brazilian Portuguese Market (`pt-BR`)
- **Concursos Públicos & Súmula 266 do STJ:**
  - Accurately cites **Súmula 266 of the Superior Tribunal de Justiça (STJ)**:
    > *"O diploma ou habilitação legal para o exercício do cargo deve ser exigido na posse e não na inscrição para o concurso público."*
  - Clarifies that candidate age eligibility must be evaluated on the date of possession (*data da posse*) rather than registration, addressing the user respectfully with *"você"*.
- **Previdência Social (INSS):**
  - References the transition rules of Constitutional Amendment EC nº 103/2019, directing users to the official Social Security portal: [gov.br/inss](https://www.gov.br/inss).
- **Código Civil Brasileiro:**
  - Cites Article 5º of Lei nº 10.406/2002 regarding civil capacity at 18 completed years.

### 2.4 Veterinary Science (Pet Age Calculators)
- Cites official guidelines from the **American Veterinary Medical Association (AVMA)** and the **American Animal Hospital Association (AAHA)**, actively debunking the obsolete 7-to-1 myth and presenting modern weight-bracketed physiological curves.

---

## 3. Trustworthiness & Data Privacy Architecture

### 3.1 100% Client-Side Privacy Guarantee
- Prominent privacy badges and disclosures assure users that birthdates, names, and milestones never leave their local browser.
- Zero tracking pixels, zero analytics logging of user inputs, and zero URL query-string leakage of birthdates.

### 3.2 Complete Trust Page Infrastructure

| Page Purpose | English Route | Spanish Route | Portuguese Route |
| :--- | :--- | :--- | :--- |
| **About Us** | `/about/` | `/es/about/` | `/pt/about/` |
| **Methodology** | `/methodology/` | `/es/methodology/` | `/pt/methodology/` |
| **Contact Support** | `/contact/` | `/es/contact/` | `/pt/contact/` |
| **Privacy Policy** | `/privacy/` | `/es/privacy/` | `/pt/privacy/` |
| **Terms of Service** | `/terms/` | `/es/terms/` | `/pt/terms/` |
| **Cookie Policy** | `/cookies/` | `/es/cookies/` | `/pt/cookies/` |

- **Official Support Email:** Displayed on all contact and trust pages (`support@agecalc.pages.dev`).
- **Privacy Disclosures:** Explicit cookie notices, Google Consent Mode v2 default denial, and opt-out links for Google Ad Settings, NAI, and EDAA/DAA.

