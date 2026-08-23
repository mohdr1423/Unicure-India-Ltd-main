/**
 * BELLA — Unicure India Information Assistant Knowledge Base & Engine
 * Primary Purpose: Answer visitor questions naturally, accurately, and politely.
 * Strict Rule: Bella is an AI customer information assistant, NOT a lead-generation form.
 */

export const BELLA_SYSTEM_PROMPT = `You are "Bella", the official AI Information Assistant for Unicure India Ltd.

YOUR ROLE & IDENTITY:
- You are a knowledgeable, polite, executive, and natural customer information assistant.
- Your primary job is to ANSWER VISITOR QUESTIONS about Unicure India Ltd.
- You speak in a natural, warm, and professional corporate pharmaceutical tone.
- You DO NOT push lead-generation forms, DO NOT ask visitors for their contact info (name, email, phone, company), and DO NOT turn conversations into sales pitches.

VERIFIED COMPANY KNOWLEDGE BASE:

1. COMPANY OVERVIEW & HISTORY:
- Company Name: Unicure India Ltd.
- Established: 1984 (Over 40 years / 4 decades of continuous pharmaceutical manufacturing excellence).
- Nature of Business: Pharmaceutical formulation manufacturing, third-party contract/co-manufacturing, institutional government supply, and global exports.
- Philosophy & Vision: Providing high-quality, accessible healthcare products to humanity.
- Scale: Net sales of ~₹2 billion growing at ~20% year-on-year, with over 600 professionals and 100+ qualified scientists/technical staff.

2. EXECUTIVE LEADERSHIP TEAM:
- Mr. Abdul Mateen — Founder & Managing Director. Over 40 years of vision and leadership. He founded the company in 1984 to serve the nation and mankind with integrity and ingenuity. Guided by Robert Frost's philosophy: "I have promises to keep and miles to go before I sleep."
- Mr. Amin Ul Aziz — Vice President of Business Development. Leads strategic commercial growth, institutional partnerships, contract manufacturing alliances, and international market penetration across 20+ countries. Philosophy: "Don't stress about not having it all figured out... Focus intently on where you are now and use this as leverage."
- Dr. Kashish Aziz — Vice President of Quality Assurance. Directs cGMP compliance, GLP analytical validation, and regulatory affairs. Pioneer of the "Quality or Quit!" philosophy based on 4 core quality principles.

3. MANUFACTURING FACILITIES & DOSAGE CAPACITIES:
Unicure India operates 3 modern manufacturing facilities in North India:
- Unit-I (Noida, Uttar Pradesh): Dedicated general formulations, oral liquids, tablets, and capsules.
- Unit-II (Roorkee, Uttarakhand): High-capacity state-of-the-art manufacturing plant dedicated to domestic and institutional supply.
- Unit-III (Greater Noida, Uttar Pradesh): Newly operational, PIC/S compliant oral solid dosage (OSD) facility built to stringent international standards.
- Annual Capacities:
  * Tablets: 6,000 Million tablets/year (high-speed rotary compression, film, sugar, enteric coating)
  * Capsules: 1,200 Million capsules/year (hard gelatin and vegetarian)
  * Liquid Orals / Syrups: 35.28 Million bottles/year
  * Dry Syrups: 12.00 Million bottles/year
  * Injections (Small Volume Parenterals): 14.40 Million ampoules & vials/year
  * Ointments, Creams & Gels: 12.00 Million tubes/year
  * Eye, Ear & Nasal Drops: 12.00 Million bottles/year
  * Sachets / Effervescent Powders: 30.00 Million sachets/year

4. QUALITY ASSURANCE & REGULATORY COMPLIANCE:
- WHO-GMP Certified facilities.
- GLP (Good Laboratory Practices) compliant analytical and microbiological testing laboratories.
- PIC/S (Pharmaceutical Inspection Co-operation Scheme) compliant systems.
- Quality Philosophy: "Quality or Quit!" led by Dr. Kashish Aziz.
- Robust in-house testing: HPLC, GC, UV-Vis Spectrophotometry, Dissolution apparatus, Stability Chambers (Zone IVb conditions), and Environmental Monitoring.

5. CONTRACT / CO-MANUFACTURING:
- Unicure is a trusted contract manufacturing partner for India's leading pharmaceutical multinationals and domestic brands, including:
  Mankind Pharma, Jagsonpal Pharmaceuticals, Obsurge Biotech, Seagull Pharma, Wings Pharma, DeVats, Ornate, Mohrish Pharmaceuticals, Iressia Life Sciences, Shifa Laboratories, Ravenbhel Healthcare, Quality Innovations & Pharmaceuticals, Cradel Pharmaceuticals, and Adips Dermatek.
- Turnkey contract services: formulation development, analytical validation, stability data, dossier preparation (ACTD/CTD), batch manufacturing, custom blister/strip/bottle packaging, and regulatory release.

6. INSTITUTIONAL & GOVERNMENT SUPPLY:
- One of India's largest institutional pharmaceutical suppliers, supplying to central institutes, armed forces, and state medical corporations across all 28 states of India:
  AIIMS (All India Institute of Medical Sciences), BPPI / PMBI (Janaushadhi), Safdarjung Hospital Delhi, Defence Supply (Armed Forces Medical Services), UPMSCL (Uttar Pradesh), JKMSCL (J&K), APMSIDC (Andhra Pradesh), BMSICL (Bihar), CGMSCL (Chhattisgarh), CPA (DHS Delhi), MCD Delhi, GMSCL (Gujarat), HBCL (Maharashtra), HPSCSCL (Himachal Pradesh), KMSCL (Kerala), KSMSCL (Karnataka), MPPHSCL (Madhya Pradesh), OSMCL (Odisha), PHSC (Punjab), RMSCL (Rajasthan), TNMSCL (Tamil Nadu), TSMSIDC (Telangana), NHM Assam, NHM Tripura, and HMSCL (Haryana).

7. INTERNATIONAL PRESENCE & EXPORT MARKETS:
- Exports to 20+ countries across Africa, Southeast Asia, CIS / Central Asia, Middle East, and Latin America.
- Featured markets: Uzbekistan, Dominican Republic, Belgium, Iraq, Iran, Tanzania, Yemen, Kenya, Senegal, Philippines, Myanmar, Sri Lanka, UAE, Ghana, Nigeria, and more.

8. THERAPEUTIC PRODUCT CATEGORIES:
- Over 500+ commercial formulations across major therapeutic segments:
  Analgesics & Antipyretics, Antibiotics & Antibacterials, Cardiovascular Drugs, Gastrointestinal (Antacids, PPIs), Respiratory & Antiallergic, Central Nervous System / Neuro-Psychiatry, Dermatology & Topical Ointments, Anti-diabetics, and Multivitamins & Nutraceuticals.

9. CONTACT & LOCATION DETAILS:
- Registered Office & Unit-I: C-21, 22 & 23 Sector-3, Noida-201301, Gautam Buddha Nagar, Uttar Pradesh, India.
- Unit-II: Roorkee, Uttarakhand.
- Unit-III: Greater Noida, Uttar Pradesh.
- Email: unicure@unicureindia.com (Quotations: inquiries@unicureindia.com)
- Phone: 0120-4786786 / +91 120 4786786
- Official YouTube Channel: https://youtube.com/@unicureindialtd9851?si=iPi8Tic09i2XwITk
- Website: https://unicureindia.com

BELLA'S CONVERSATIONAL RULES:
1. ANSWER QUESTIONS NATURALLY: When asked a question, provide a clear, informative, and engaging answer based directly on the verified facts above.
2. DO NOT PUSH FORMS: Never ask the visitor for their personal info, phone number, email, or company during normal conversation. Never show an inquiry form unprompted.
3. MEDICAL DISCLAIMER: If a visitor asks for personal medical advice, diagnosis, treatment, prescription, or drug dosage:
"I can provide information about Unicure India and its publicly available pharmaceutical information, but I can't provide personalized medical advice or recommend treatment or dosage. Please consult a qualified healthcare professional."
4. UNKNOWN QUESTIONS: If a question is outside the verified information above, say:
"I don't have enough verified information to answer that accurately." then provide the closest relevant company information from the website.
5. EXPLICIT QUOTE / ORDER REQUESTS: Only if the visitor explicitly asks for a quotation, pricing, contract manufacturing proposal, or business contact, say:
"For formal quotations, manufacturing proposals, and business enquiries, you can reach our team via our [Contact Page](/contact) or email us directly at unicure@unicureindia.com."`;

/**
 * Natural offline fallback knowledge matcher for Bella.
 * Answers all common inquiries with verified corporate information.
 */
export function getLocalBellaResponse(userMessage: string): { reply: string } {
  const lower = userMessage.toLowerCase().trim();

  // 1. Safety Guardrail: Medical advice, prescription, dosage, treatment
  if (
    lower.includes("prescribe") ||
    lower.includes("prescription") ||
    lower.includes("medical advice") ||
    lower.includes("cure my") ||
    lower.includes("take this medicine") ||
    lower.includes("dosage for") ||
    lower.includes("side effect of taking") ||
    lower.includes("diagnos") ||
    lower.includes("disease treatment") ||
    lower.includes("symptoms of")
  ) {
    return {
      reply:
        "I can provide information about Unicure India and its publicly available pharmaceutical information, but I can't provide personalized medical advice or recommend treatment or dosage. Please consult a qualified healthcare professional.",
    };
  }

  // 2. Greetings
  if (
    lower === "hi" ||
    lower === "hello" ||
    lower === "hey" ||
    lower === "good morning" ||
    lower === "good afternoon" ||
    lower === "good evening" ||
    lower.startsWith("hi ") ||
    lower.startsWith("hello ")
  ) {
    return {
      reply:
        "Hi! I'm Bella, the Unicure India Assistant. How can I help you today?",
    };
  }

  // 3. What does Unicure India do / About Company
  if (
    lower.includes("what does unicure") ||
    lower.includes("about unicure") ||
    lower.includes("who is unicure") ||
    lower.includes("tell me about unicure") ||
    lower.includes("company background") ||
    lower.includes("overview")
  ) {
    return {
      reply:
        "Unicure India Ltd is a premier pharmaceutical manufacturing company established in 1984. Over the past four decades, we have grown into one of India's leading pharmaceutical formulation manufacturers, operating across commercial manufacturing, co-manufacturing for top pharmaceutical brands, institutional supplies across 28 Indian states, and global exports to over 20 countries.",
    };
  }

  // 4. Leadership: Mr. Abdul Mateen
  if (
    lower.includes("abdul mateen") ||
    lower.includes("managing director") ||
    lower.includes("founder") ||
    lower.includes("md") ||
    lower.includes("who founded")
  ) {
    return {
      reply:
        "Mr. Abdul Mateen is the Founder & Managing Director of Unicure India Ltd. He has steered the organization for over 40 years since its inception in 1984 with a core commitment to integrity, ingenuity, and serving mankind at large. He is famously guided by Robert Frost's timeless line: *'I have promises to keep and miles to go before I sleep.'*",
    };
  }

  // 5. Leadership: Mr. Amin Ul Aziz
  if (
    lower.includes("amin ul aziz") ||
    lower.includes("amin") ||
    lower.includes("business development") ||
    lower.includes("vp bd")
  ) {
    return {
      reply:
        "Mr. Amin Ul Aziz is the Vice President of Business Development at Unicure India Ltd. He leads strategic commercial growth, institutional supply partnerships, third-party manufacturing alliances, and international market penetration across 20+ countries.",
    };
  }

  // 6. Leadership: Dr. Kashish Aziz
  if (
    lower.includes("kashish aziz") ||
    lower.includes("kashish") ||
    lower.includes("quality assurance") ||
    lower.includes("vp qa") ||
    lower.includes("quality head")
  ) {
    return {
      reply:
        "Dr. Kashish Aziz is the Vice President of Quality Assurance at Unicure India Ltd. He directs the company's cGMP compliance, GLP analytical validation, and regulatory affairs, upholding the company's signature philosophy: *'Quality or Quit!'* across all four quality principles.",
    };
  }

  // 7. Leadership Team overview
  if (
    lower.includes("leadership") ||
    lower.includes("management") ||
    lower.includes("executives") ||
    lower.includes("board of directors") ||
    lower.includes("who runs")
  ) {
    return {
      reply:
        "Unicure India is led by an experienced executive leadership team:\n\n- **Mr. Abdul Mateen** — Managing Director (Founder with 40+ years of vision)\n- **Mr. Amin Ul Aziz** — Vice President of Business Development (Commercial growth & international operations)\n- **Dr. Kashish Aziz** — Vice President of Quality Assurance (cGMP compliance & quality systems)",
    };
  }

  // 8. Manufacturing Capabilities & Capacities
  if (
    lower.includes("manufactur") ||
    lower.includes("capabilit") ||
    lower.includes("capacit") ||
    lower.includes("dosage") ||
    lower.includes("tablet") ||
    lower.includes("capsule") ||
    lower.includes("syrup") ||
    lower.includes("injection") ||
    lower.includes("ointment") ||
    lower.includes("sachet")
  ) {
    return {
      reply:
        "Unicure India operates three advanced manufacturing facilities with high-volume annual capacities:\n\n- **Tablets:** 6,000 Million / year\n- **Capsules:** 1,200 Million / year\n- **Liquid Orals:** 35.28 Million bottles / year\n- **Dry Syrups:** 12.00 Million bottles / year\n- **Injections (Ampoules/Vials):** 14.40 Million / year\n- **Ointments, Creams & Gels:** 12.00 Million tubes / year\n- **Eye/Ear/Nasal Drops:** 12.00 Million bottles / year\n- **Sachets:** 30.00 Million / year",
    };
  }

  // 9. Manufacturing Plants & Units
  if (
    lower.includes("plants") ||
    lower.includes("facilities") ||
    lower.includes("unit 1") ||
    lower.includes("unit 2") ||
    lower.includes("unit 3") ||
    lower.includes("unit-i") ||
    lower.includes("unit-ii") ||
    lower.includes("unit-iii") ||
    lower.includes("greater noida") ||
    lower.includes("roorkee") ||
    lower.includes("location") ||
    lower.includes("where are your plants")
  ) {
    return {
      reply:
        "Unicure India has three state-of-the-art production facilities in North India:\n\n1. **Unit-I (Noida, UP):** C-22, Phase-II, dedicated to oral dosage forms, liquids, and general formulations.\n2. **Unit-II (Roorkee, Uttarakhand):** High-capacity formulation block for domestic and institutional supplies.\n3. **Unit-III (Greater Noida, UP):** Newly operational PIC/S compliant oral solid dosage (OSD) facility built to global standards.",
    };
  }

  // 10. Co-Manufacturing & Contract Manufacturing Clients
  if (
    lower.includes("co-manufacturing") ||
    lower.includes("contract manufacturing") ||
    lower.includes("third party") ||
    lower.includes("clients") ||
    lower.includes("partners") ||
    lower.includes("mankind") ||
    lower.includes("jagsonpal")
  ) {
    return {
      reply:
        "Unicure India is a trusted contract manufacturing partner for leading pharmaceutical brands, including **Mankind Pharma, Jagsonpal Pharmaceuticals, Obsurge Biotech, Seagull Pharma, Wings Pharma, DeVats, Ornate, Mohrish, Iressia, Shifa Laboratories, Ravenbhel, Quality Innovations, Cradel, and Adips Dermatek**.\n\nWe provide full turnkey services including formulation development, stability studies, analytical testing, regulatory CTD dossiers, and commercial batch manufacturing.",
    };
  }

  // 11. International Operations & Export Countries
  if (
    lower.includes("export") ||
    lower.includes("international") ||
    lower.includes("countries") ||
    lower.includes("global") ||
    lower.includes("foreign") ||
    lower.includes("overseas") ||
    lower.includes("senegal") ||
    lower.includes("uzbekistan") ||
    lower.includes("philippines") ||
    lower.includes("kenya")
  ) {
    return {
      reply:
        "Unicure India has an international footprint across 20+ countries in Africa, Southeast Asia, CIS/Central Asia, Middle East, and Latin America. Active markets include **Uzbekistan, Dominican Republic, Belgium, Iraq, Iran, Tanzania, Yemen, Kenya, Senegal, Philippines, Myanmar, Sri Lanka, UAE, Ghana, and Nigeria**.",
    };
  }

  // 12. Quality Standards, WHO-GMP & Certifications
  if (
    lower.includes("quality") ||
    lower.includes("gmp") ||
    lower.includes("who-gmp") ||
    lower.includes("who gmp") ||
    lower.includes("certification") ||
    lower.includes("pic/s") ||
    lower.includes("glp") ||
    lower.includes("standards")
  ) {
    return {
      reply:
        "Quality is at the core of Unicure India. Our facilities are **WHO-GMP certified**, **GLP compliant**, and follow **PIC/S international guidelines**. Our analytical laboratories are equipped with advanced HPLC, GC, UV-Vis spectrophotometers, dissolution stations, and Zone IVb stability chambers under the stewardship of Dr. Kashish Aziz.",
    };
  }

  // 13. Institutional Sales & Government Supply
  if (
    lower.includes("institutional") ||
    lower.includes("aiims") ||
    lower.includes("safdarjung") ||
    lower.includes("bppi") ||
    lower.includes("defence") ||
    lower.includes("government") ||
    lower.includes("tender")
  ) {
    return {
      reply:
        "Unicure India is one of the largest institutional pharmaceutical suppliers in India, supplying trusted medicines to premier institutes such as **AIIMS**, **Safdarjung Hospital Delhi**, **BPPI/PMBI (Janaushadhi)**, **Defence Supply (Armed Forces Medical Services)**, and State Medical Corporations across all 28 states (including UPMSCL, RMSCL, TNMSCL, KMSCL, BMSICL, GMSCL, and others).",
    };
  }

  // 14. Products & Therapeutic Categories
  if (
    lower.includes("product") ||
    lower.includes("medicine") ||
    lower.includes("drug") ||
    lower.includes("therapeutic") ||
    lower.includes("antibiotic") ||
    lower.includes("analgesic") ||
    lower.includes("paracetamol")
  ) {
    return {
      reply:
        "Unicure India manufactures over 500+ commercial formulations across major therapeutic categories: **Analgesics & Antipyretics, Antibiotics, Cardiovascular, Gastrointestinal, Respiratory, Dermatology, Neuro-Psychiatry, and Multivitamins/Nutraceuticals**. You can explore our therapeutic offerings in the Products section of our website.",
    };
  }

  // 15. History / Established Year
  if (
    lower.includes("established") ||
    lower.includes("history") ||
    lower.includes("when was") ||
    lower.includes("1984") ||
    lower.includes("how old") ||
    lower.includes("experience")
  ) {
    return {
      reply:
        "Unicure India Ltd was established in 1984 by Mr. Abdul Mateen. With over 40 years of dedicated pharmaceutical manufacturing experience, the company has grown from a single manufacturing unit to three modern facilities with nationwide and global distribution.",
    };
  }

  // 16. Careers / Jobs
  if (
    lower.includes("career") ||
    lower.includes("job") ||
    lower.includes("vacancy") ||
    lower.includes("hiring") ||
    lower.includes("apply") ||
    lower.includes("hr")
  ) {
    return {
      reply:
        "Unicure India employs over 600 professionals. We regularly recruit across production, quality control, R&D, regulatory affairs, and commercial operations. You can view open positions and submit your application on our [Careers page](/careers) or email careers@unicureindia.com.",
    };
  }

  // 17. Contact Details / Inquiries / Quotations
  if (
    lower.includes("contact") ||
    lower.includes("quote") ||
    lower.includes("quotation") ||
    lower.includes("order") ||
    lower.includes("inquiry") ||
    lower.includes("phone") ||
    lower.includes("email") ||
    lower.includes("address") ||
    lower.includes("sales team")
  ) {
    return {
      reply:
        "You can connect with our team through the following channels:\n\n- **Corporate Email:** unicure@unicureindia.com\n- **Sales & Quotes:** inquiries@unicureindia.com\n- **Phone:** 0120-4786786 / +91 120 4786786\n- **Head Office:** C-21, 22 & 23 Sector-3, Noida-201301, U.P., India\n- **Online Inquiry:** You can submit your requirements on our [Contact page](/contact).",
    };
  }

  // 18. YouTube & Social Media Channels
  if (
    lower.includes("youtube") ||
    lower.includes("channel") ||
    lower.includes("video") ||
    lower.includes("social") ||
    lower.includes("linkedin") ||
    lower.includes("media")
  ) {
    return {
      reply:
        "You can explore Unicure India's official media channels:\n\n- **YouTube Channel:** [Unicure India Ltd on YouTube](https://youtube.com/@unicureindialtd9851?si=iPi8Tic09i2XwITk)\n- **LinkedIn:** [Unicure India Ltd on LinkedIn](https://www.linkedin.com/company/unicure-india-ltd/)\n- **IndiaMART:** [Unicure India Profile](https://www.indiamart.com/company/2819872/)\n- **Justdial:** [Unicure India on Justdial](https://www.justdial.com/Noida/Unicure-India-Pvt-Ltd-Near-Uco-Bank-Noida-Sector-3/011PXX11-XX11-000772394792-T8E2_BZDET)",
    };
  }

  // 19. Default / Fallback Response
  return {
    reply:
      "Unicure India Ltd is a WHO-GMP certified pharmaceutical formulation manufacturer established in 1984, specializing in high-volume oral solid dosage, liquids, dry syrups, injections, and ointments across domestic institutional networks and 20+ export countries. How can I assist you with information about our operations?",
  };
}
