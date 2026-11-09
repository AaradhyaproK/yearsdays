# Translation & Localization Review Checklist

This checklist is provided for native-speaker editorial review across all supported languages before promoting a language into `LAUNCH_LANGS`.

---

## General Review Guidelines
1. **No Machine Translation Artifacts:** Every sentence must sound natural, professional, and authoritative in the target locale. Avoid literal translations of English idioms.
2. **Statutory & Legal Disclaimers:** Whenever laws, pensions, exams, or age thresholds are discussed, confirm the disclaimer is prominent: *"Rules vary and change over time; always consult the official gazette or competent administrative authority."*
3. **Punctuation & Typography:** Verify decimal and thousand separators:
   - English (en): `1,000` (comma) and `3.5` (dot)
   - Spanish (es) & Portuguese (pt-BR) & German (de) & Italian (it) & French (fr) & Turkish (tr): thousand separator with period (`1.000`) or narrow space (`1 000` in French).
4. **Layout Stress Test:** Ensure headings and labels do not wrap awkwardly or break containers on 360px mobile viewports (especially in German and Portuguese, which can be 30–40% longer).

---

## Language-Specific Review Checklists

### 1. English (`en`)
- **Files:** `src/i18n/en.json`, `src/content/editorial/en.mdx`
- [x] Clear explanation of Gregorian borrow logic with worked example (March 20, 2000 to March 15, 2024).
- [x] Nuanced explanation of February 29 conventions (Feb 28 common practice vs March 1 English statutory rule).
- [x] Tone is objective, authoritative, and clean of keyword stuffing.
- [x] 6 FAQs phrased as real user search queries.

### 2. Spanish (`es` — International / Spain & LatAm)
- **Files:** `src/i18n/es.json`, `src/content/editorial/es.mdx`
- [x] Natural terminology: *oposiciones*, *cómputo civil*, *mayoría de edad*, *jubilación ordinaria*, *DNI/NIE*, *año bisiesto*.
- [x] Reference to Article 315 of the Spanish Civil Code (and equivalent Latin American civil codes).
- [x] Proper accentuation throughout (*cumpleaños*, *cronológico*, *pública*, *artículo*).
- [x] Disclaimer added: *"Las normativas y requisitos administrativos varían y cambian con frecuencia; compruebe siempre las bases de la convocatoria..."*

### 3. Portuguese (`pt` — Brazil / `pt-BR`)
- **Files:** `src/i18n/pt.json`, `src/content/editorial/pt.mdx`
- [x] Natural Brazilian Portuguese phrasing: *concursos públicos*, *posse no cargo*, *aposentadoria pelo INSS*, *Reforma da Previdência (EC 103/2019)*, *maioridade civil aos 18 anos*, *CNH*, *ano bissexto*.
- [x] References Article 27 of the Estatuto do Idoso (Lei nº 10.741/2003) for tie-breaking rules.
- [x] Full LGPD (Lei Geral de Proteção de Dados) compliance notes.
- [x] Disclaimer added: *"Regras previdenciárias do INSS, requisitos de concursos e normas estatutárias mudam periodicamente..."*

### 4. German (`de` — Germany, Austria, Switzerland)
- **Files:** `src/i18n/de.json`, `src/content/editorial/de.mdx`
- [x] Accurate German civil law concepts: *Volljährigkeit (§ 2 BGB)*, *Fristberechnung (§ 187, § 188 BGB)*, *Regelaltersgrenze (SGB VI)*, *Einschulungsstichtage der Bundesländer*, *Schaltjahr*.
- [x] German compound words formatted naturally without hyphenation errors.
- [x] Correct gender and case endings (*des 18. Lebensjahres*, *am 28. Februar*).
- [x] Disclaimer added: *"Behördliche Stichtage, Rentenregelungen und gesetzliche Fristen können Änderungen unterliegen..."*

### 5. French (`fr` — France, Belgium, Switzerland, Canada)
- **Files:** `src/i18n/fr.json`, `src/content/editorial/fr.mdx`
- [x] Natural administrative French: *majorité civile (art. 388 Code civil)*, *concours de la fonction publique*, *départ à la retraite*, *trimestres de cotisation*, *année bissextile*.
- [x] Correct French spacing before double punctuation marks (`:`, `?`, `!`) and apostrophes.
- [x] Disclaimer added: *"Les textes législatifs, règlements de concours et conditions de retraite évoluent régulièrement..."*

### 6. Italian (`it` — Italy)
- **Files:** `src/i18n/it.json`, `src/content/editorial/it.mdx`
- [x] Authentic legal terminology: *compimento della maggiore età (art. 2 Codice Civile)*, *concorsi pubblici*, *età pensionabile INPS*, *anno bisestile*.
- [x] Natural flow and grammar (*diciottesimo anno compiuto*, *decorrenza della pensione*).
- [x] Disclaimer added: *"I requisiti anagrafici per concorsi e pensioni variano in base alla normativa vigente..."*

### 7. Turkish (`tr` — Turkey)
- **Files:** `src/i18n/tr.json`, `src/content/editorial/tr.mdx`
- [x] Local statutory reality: *askerlik çağı ve tecil (7179 sayılı Askeralma Kanunu)*, *emeklilik yaşı ve EYT koşulları (SGK)*, *doldurulan yaş vs gün alınan yaş*, *artık yıl*.
- [x] Strict adherence to Turkish dotted and dotless I letters: `İ` / `i`, `I` / `ı` (*İletişim*, *Yaş Hesaplama*, *Gizlilik*, *Doğum Tarihi*).
- [x] KVKK (Kişisel Verilerin Korunması Kanunu) privacy compliance notes.
- [x] Disclaimer added: *"Askerlik, emeklilik ve kamu personeli alım koşulları mevzuat değişikliklerine tabidir..."*

---

## Sign-off Protocol
Before enabling any language in `LAUNCH_LANGS`:
1. Native speaker verifies the checklist above for that language.
2. Reviewer confirms that no legal threshold (e.g. precise retirement age) is stated without official citation.
3. Sign-off recorded with date and reviewer name.

