# Multilingual On-Page SEO Specifications (Launch Batch 1)

This specification defines the complete on-page architecture, metadata, schema markup, featured snippet answer blocks, worked examples, and localized context for the **Launch Batch 1** pages in **English (`en`)**, **Spanish (`es`, Neutral Latin American)**, and **Brazilian Portuguese (`pt-BR`)**.

---

## Architecture Standards for Every Page

1. **Title Tag ($\le 60$ characters):** Primary keyword near the start, concrete benefit or precision marker.
2. **Meta Description ($\le 155$ characters):** Direct hook answering user intent + concrete feature (no keyword stuffing).
3. **Primary Heading (H1):** Exactly one H1 per page containing the primary keyword naturally.
4. **Direct Answer / Definition Block (40–60 words):** Placed directly below the H1 and above the tool for Featured Snippet and AI Overview capture.
5. **Interactive Tool Island:** Client-side Preact island executing with 0 latency and 100% privacy.
6. **Worked Real-World Example:** Manual step-by-step breakdown using localized date formats (MM/DD/YYYY for US English; DD/MM/YYYY for Spanish and Brazilian Portuguese) and localized number punctuation (`,` vs `.`).
7. **Statutory & Regional Context Block:**
   - **`en`:** Age as on a cutoff date for competitive civil service exams and job forms.
   - **`es`:** Administrative procedures, *cédula / DNI*, and retirement planning across Latin America.
   - **`pt-BR`:** *Concursos públicos* (age verified on *data da posse*), *INSS*, and identity documents using respectful "você".
8. **Structured Data:** Fully validated `WebApplication`, `BreadcrumbList`, and `FAQPage` JSON-LD matching visible text verbatim.
9. **6–8 PAA-Derived FAQs:** Detailed, non-generic answers addressing calendar irregularities, leap years, and legal thresholds.
10. **Contextual Internal Links:** 3–5 descriptive in-text links to related tools and trust pages.

---

## PAGE 1: Main Age Calculator

### 1.1 English (`/`)
- **Canonical URL:** `https://yourdomain.com/`
- **Primary Keyword:** `age calculator`
- **Secondary Keywords:** `calculate age`, `how old am I`, `age calculator by date of birth`, `exact age calculator`, `chronological age calculator`
- **Title ($\le 60$ chars):** `Age Calculator: Exact Age in Years, Months & Days` *(49 chars)*
- **Meta Description ($\le 155$ chars):** `Calculate your exact chronological age today in years, months, days, hours, and minutes. 100% private, client-side date calculation with upcoming milestones.` *(152 chars)*
- **H1:** `Age Calculator: Calculate Your Exact Age Today`
- **Direct Answer Block (51 words):**
  > An age calculator determines the exact elapsed chronological time between your date of birth and the current date (or a chosen target date). It breaks down your lifespan into discrete calendar years, complete calendar months, and remaining days, while accounting for leap years, variable month lengths, and daylight saving time adjustments.
- **H2 Structure:**
  - `H2: How Does Chronological Age Calculation Work?`
  - `H2: Step-by-Step Worked Example: Calculating Exact Age`
  - `H2: Age as on a Cutoff Date for Exams and Applications`
  - `H2: Key Life Milestones and Astronomical Facts`
  - `H2: Frequently Asked Questions About Age Calculation`
- **Cutoff Context Section:** Details how exam boards and employers (such as UPSC, SSC, state PSCs in India, and civil service recruitment bodies worldwide) define age as of a specific qualifying date (e.g., August 1 or January 1). Includes direct links to official public notification guidelines without stating arbitrary statutory ages.
- **FAQs (FAQPage JSON-LD):**
  1. *How is exact age calculated in years, months, and days?*
  2. *How do leap years affect my age calculation?*
  3. *Why do different age calculators show different day counts?*
  4. *What is my chronological age vs. biological age?*
  5. *What day of the week was I born on?*
  6. *Is my date of birth stored or sent to a server?*
  7. *How does the calculator handle births on February 29?*

---

### 1.2 Spanish (`/es/`)
- **Canonical URL:** `https://yourdomain.com/es/`
- **Primary Keyword:** `calculadora de edad`
- **Secondary Keywords:** `calcular edad`, `cuántos años tengo`, `calcular edad exacta`, `calcular edad por fecha de nacimiento`, `calcular edad cronológica`
- **Title ($\le 60$ chars):** `Calculadora de Edad Exacta: años, meses y días` *(46 chars)*
- **Meta Description ($\le 155$ chars):** `Calcula tu edad cronológica exacta hoy en años, meses, días y minutos. Herramienta privada y gratuita con cálculo de próximos hitos y datos astronómicos.` *(151 chars)*
- **H1:** `Calculadora de Edad: Calcula Tu Edad Exacta Hoy`
- **Direct Answer Block (49 words):**
  > Una calculadora de edad determina el tiempo cronológico transcurrido entre la fecha de nacimiento y la fecha actual o una fecha límite específica. Expresa la duración en años cumplidos, meses y días exactos, considerando las irregularidades del calendario gregoriano como años bisiestos y meses de diferente duración.
- **H2 Structure:**
  - `H2: ¿Cómo calcular tu edad exacta paso a paso?`
  - `H2: Ejemplo práctico de cálculo de edad cronológica`
  - `H2: La edad en trámites oficiales: cédula, DNI y convocatorias públicas`
  - `H2: Hitos de vida y datos astronómicos calculados`
  - `H2: Preguntas frecuentes sobre el cálculo de edad`
- **Regional Context Section:** Addresses Latin American administrative formalities: renewing identification cards (*cédula de identidad, DNI, pasaporte*), qualifying for public tenders (*convocatorias laborales del Estado*), and school registration windows where age is evaluated on a strict cutoff date.
- **FAQs (FAQPage JSON-LD):**
  1. *¿Cómo se calcula exactamente la edad en años, meses y días?*
  2. *¿Qué ocurre si nací un 29 de febrero en un año bisiesto?*
  3. *¿Por qué algunas calculadoras dan resultados distintos en días?*
  4. *¿Cómo saber cuántos días he vivido en total?*
  5. *¿Se guardan mis fechas de nacimiento en algún servidor?*
  6. *¿Qué diferencia hay entre edad cronológica y edad biológica?*

---

### 1.3 Brazilian Portuguese (`/pt/`)
- **Canonical URL:** `https://yourdomain.com/pt/`
- **Primary Keyword:** `calculadora de idade`
- **Secondary Keywords:** `calcular idade`, `quantos anos eu tenho`, `calcular idade exata`, `calcular idade pela data de nascimento`, `como calcular a idade cronológica`
- **Title ($\le 60$ chars):** `Calculadora de Idade Exata: anos, meses e dias` *(46 chars)*
- **Meta Description ($\le 155$ chars):** `Calcule sua idade cronológica exata hoje em anos, meses e dias. Ferramenta 100% privada e rápida com contagem de marcos de vida e fatos astronômicos.` *(149 chars)*
- **H1:** `Calculadora de Idade: Calcule Sua Idade Exata Hoje`
- **Direct Answer Block (50 words):**
  > Uma calculadora de idade computa o intervalo cronológico exato entre a data de nascimento e a data atual ou uma data de referência. O resultado é decomposto em anos completos, meses e dias restantes, compensando automaticamente anos bissextos e durações variáveis dos meses no calendário gregoriano.
- **H2 Structure:**
  - `H2: Como calcular a sua idade exata passo a passo`
  - `H2: Exemplo prático de cálculo de idade cronológica`
  - `H2: Idade em concursos públicos e documentos no Brasil`
  - `H2: Marcos cronológicos de vida e fatos cósmicos`
  - `H2: Perguntas frequentes sobre o cálculo de idade`
- **Regional Context Section (using respectful "você"):** Focuses on Brazilian administrative realities: civil service examinations (*concursos públicos*), citing established Brazilian jurisprudence that age requirements are assessed on the date of possession (*data da posse*) rather than registration, as well as retirement planning (*INSS*) and school admissions (*corte etário*).
- **FAQs (FAQPage JSON-LD):**
  1. *Como calcular a idade exata em anos, meses e dias?*
  2. *Como é calculada a idade de quem nasceu em 29 de fevereiro?*
  3. *Qual a diferença entre idade cronológica e idade biológica?*
  4. *A data informada é enviada para algum servidor?*
  5. *Como saber o dia da semana em que você nasceu?*
  6. *Quantos dias de vida eu tenho no total?*

---

## PAGE 2: Age on a Specific Date

### 2.1 English (`/age-on-a-date/`)
- **Canonical URL:** `https://yourdomain.com/age-on-a-date/`
- **Primary Keyword:** `age on a specific date`
- **Secondary Keywords:** `age as on date calculator`, `calculate age on a future date`, `how old will I be on`, `age cutoff calculator for exams`, `how old was I on this date`
- **Title ($\le 60$ chars):** `Age on a Specific Date Calculator: Cutoff & Past Age` *(52 chars)*
- **Meta Description ($\le 155$ chars):** `Calculate your exact age on any past, present, or future cutoff date. Ideal for civil service exams, school admissions, job applications, and retirement.` *(152 chars)*
- **H1:** `Age on a Specific Date Calculator`
- **Direct Answer Block (52 words):**
  > An age on a specific date calculator computes your exact chronological age at any selected calendar date in the past or future. It compares your date of birth against an arbitrary reference point, providing the precise elapsed duration in completed years, months, and days required for statutory eligibility and administrative applications.
- **Featured Cutoff Guide:** "Understanding 'Age as on' Eligibility Cutoff Dates" with official exam guidance (UPSC, SSC, state PSC cutoffs) explaining how to count completed years on statutory deadlines.

---

### 2.2 Spanish (`/es/edad-en-una-fecha/`)
- **Canonical URL:** `https://yourdomain.com/es/edad-en-una-fecha/`
- **Primary Keyword:** `calcular edad en una fecha`
- **Secondary Keywords:** `edad a una fecha determinada`, `calcular edad en una fecha específica`, `cuántos años tendré en tal fecha`, `edad cumplida a una fecha`, `calculadora fecha de corte`
- **Title ($\le 60$ chars):** `Calcular Edad en una Fecha: Fechas Límite y Trámites` *(51 chars)*
- **Meta Description ($\le 155$ chars):** `Calcula tu edad exacta en cualquier fecha pasada o futura. Verifica requisitos para convocatorias públicas, jubilación, trámites de cédula y matrículas.` *(153 chars)*
- **H1:** `Calcular Edad en una Fecha Determinada`
- **Direct Answer Block (48 words):**
  > Esta calculadora permite determinar con precisión matemática la edad cronológica que tenías en una fecha pasada o la que tendrás en una fecha futura. Resulta fundamental para comprobar requisitos de edad en convocatorias de empleo público, admisiones académicas, trámites notariales y requisitos jubilatorios en América Latina.

---

### 2.3 Brazilian Portuguese (`/pt/idade-em-uma-data/`)
- **Canonical URL:** `https://yourdomain.com/pt/idade-em-uma-data/`
- **Primary Keyword:** `calcular idade em uma data`
- **Secondary Keywords:** `idade em data específica`, `calcular idade em determinada data`, `idade para concurso publico na data da posse`, `quantos anos eu tinha em tal ano`, `idade limite concurso público`
- **Title ($\le 60$ chars):** `Calcular Idade em uma Data: Concursos e Documentos` *(50 chars)*
- **Meta Description ($\le 155$ chars):** `Descubra sua idade exata em qualquer data passada ou futura. Ideal para verificar requisitos de concursos públicos na data da posse, INSS e matrículas.` *(151 chars)*
- **H1:** `Calcular Idade em uma Data Específica`
- **Direct Answer Block (50 words):**
  > A calculadora de idade em uma data específica determina a sua idade cronológica em um dia determinado do passado ou do futuro. O cálculo compara a sua data de nascimento com a data-alvo, informando os anos, meses e dias exatos exigidos em editais de concursos públicos e procedimentos administrativos.

---

## PAGE 3: Days Alive Calculator

### 3.1 English (`/days-alive/`)
- **Canonical URL:** `https://yourdomain.com/days-alive/`
- **Primary Keyword:** `days alive calculator`
- **Secondary Keywords:** `how many days old am I`, `how many days have I been alive`, `10000 days old`, `how many hours have I been alive`, `calculate days of life`
- **Title ($\le 60$ chars):** `Days Alive Calculator: How Many Days Old Are You?` *(49 chars)*
- **Meta Description ($\le 155$ chars):** `Discover the exact number of days, hours, and minutes you have lived on Earth. Calculate your next 10,000-day milestone with our private, real-time tool.` *(152 chars)*
- **H1:** `Days Alive Calculator: Exactly How Many Days Have You Lived?`
- **Direct Answer Block (48 words):**
  > A days alive calculator computes the cumulative total number of calendar days elapsed since the day of your birth. By converting your lifespan into continuous 24-hour solar days, it reveals unique personal milestones such as your 10,000th or 20,000th day on Earth alongside vital biological and cosmic statistics.
- **Milestone Showcase:** Detailed guide to celebrating your 10,000th day (~27.4 years) and 20,000th day (~54.7 years), complete with countdown target dates and average lifetime heartbeats.

---

### 3.2 Spanish (`/es/dias-de-vida/`)
- **Canonical URL:** `https://yourdomain.com/es/dias-de-vida/`
- **Primary Keyword:** `calcular días de vida`
- **Secondary Keywords:** `cuántos días tengo de vida`, `cuántos días he vivido`, `10000 días de vida`, `cuántas horas he vivido`, `calculadora de días vividos`
- **Title ($\le 60$ chars):** `Calculadora de Días de Vida: ¿Cuántos Días Has Vivido?` *(53 chars)*
- **Meta Description ($\le 155$ chars):** `Calcula cuántos días, horas y minutos has vivido en la Tierra. Descubre cuándo cumplirás 10.000 días de vida y consulta datos vitales y astronómicos.` *(149 chars)*
- **H1:** `Calculadora de Días de Vida: Descubre Cuántos Días Tienes`
- **Direct Answer Block (49 words):**
  > La calculadora de días de vida suma el total exacto de días solares transcurridos desde tu fecha de nacimiento hasta hoy. Esta medida continua permite descubrir hitos cronológicos poco conocidos, como la fecha exacta en que cumples 10.000 o 20.000 días en la Tierra, acompañada de curiosidades biológicas y astronómicas.

---

### 3.3 Brazilian Portuguese (`/pt/dias-de-vida/`)
- **Canonical URL:** `https://yourdomain.com/pt/dias-de-vida/`
- **Primary Keyword:** `calcular dias de vida`
- **Secondary Keywords:** `quantos dias eu tenho de vida`, `quantos dias já vivi`, `10000 dias de vida calcular`, `quantas horas de vida eu tenho`, `calculadora de dias vividos`
- **Title ($\le 60$ chars):** `Calculadora de Dias de Vida: Quantos Dias Já Viveu?` *(51 chars)*
- **Meta Description ($\le 155$ chars):** `Descubra exatamente quantos dias, horas e minutos você já viveu na Terra. Calcule seu próximo marco de 10.000 dias com esta ferramenta rápida e 100% privada.` *(157 chars)*
- **H1:** `Calculadora de Dias de Vida: Descubra Quantos Dias Você Tem`
- **Direct Answer Block (51 words):**
  > A calculadora de dias de vida calcula a soma total de dias corridos transcorridos desde a sua data de nascimento até o momento atual. Ela transforma a sua existência em uma contagem contínua, permitindo comemorar marcos marcantes como o seu aniversário de 10.000 dias de vida na Terra.

