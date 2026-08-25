import type { CertificateDoc } from "@/components/site/CertificateViewerModal";

export interface UnitCertifications {
  id: string;
  name: string;
  location: string;
  subtitle: string;
  description: string;
  certificates: CertificateDoc[];
}

export const UNIT_CERTIFICATIONS: UnitCertifications[] = [
  {
    id: "unit-1",
    name: "Unit-I — Noida Sector-3",
    location: "Plant C-21, 22 & 23, Sector-3, Noida, Uttar Pradesh",
    subtitle: "Established 1984 • Mother Plant & Formulation Center",
    description:
      "Our flagship manufacturing facility operating under continuous WHO-GMP compliance, state drug licensing, and ISO quality management systems.",
    certificates: [
      {
        id: "u1-form-25",
        name: "Form 25 (Manufacturing Licence)",
        unit: "Unit-I — Noida Sector-3",
        unitSubtitle: "Plant C-21, 22 & 23, Sector-3, Noida (U.P.)",
        category: "licence",
        fileUrl: "/downloads/Mfg._license_form_25.pdf",
        fileSize: "403 KB",
        issuingAuthority: "State Licensing Authority & FDA India",
        description:
          "Licence to manufacture for sale or distribution of drugs other than those specified in Schedule C, C(1) and X.",
      },
      {
        id: "u1-form-28",
        name: "Form 28 (Manufacturing Licence)",
        unit: "Unit-I — Noida Sector-3",
        unitSubtitle: "Plant C-21, 22 & 23, Sector-3, Noida (U.P.)",
        category: "licence",
        fileUrl: "/downloads/Mfg._license_form_28.pdf",
        fileSize: "403 KB",
        issuingAuthority: "State Licensing Authority & FDA India",
        description:
          "Licence to manufacture for sale or distribution of drugs specified in Schedule C and C(1).",
      },
      {
        id: "u1-who-gmp",
        name: "WHO-GMP Certificate",
        unit: "Unit-I — Noida Sector-3",
        unitSubtitle: "Plant C-21, 22 & 23, Sector-3, Noida (U.P.)",
        category: "gmp",
        fileUrl: "/downloads/WHO_GMP_Certificate_Unit_1.pdf",
        fileSize: "350 KB",
        issuingAuthority: "World Health Organization / State FDA",
        description:
          "Certificate of Good Manufacturing Practices confirming compliance with WHO-GMP guidelines for pharmaceutical products.",
      },
      {
        id: "u1-form-26",
        name: "Form 26 (Manufacturing Licence Unit-I)",
        unit: "Unit-I — Noida Sector-3",
        unitSubtitle: "Plant C-21, 22 & 23, Sector-3, Noida (U.P.)",
        category: "licence",
        fileUrl: "/downloads/MANUFACTURING_LICENSE_Unit1.pdf",
        fileSize: "1.0 MB",
        issuingAuthority: "Food & Drug Administration (FDA) UP",
        description:
          "Official Manufacturing Licence for Unit-I covering tablets, capsules, liquids, dry syrups and ointments.",
      },
      {
        id: "u1-who-cgmp",
        name: "WHO cGMP Certificate",
        unit: "Unit-I — Noida Sector-3",
        unitSubtitle: "Plant C-21, 22 & 23, Sector-3, Noida (U.P.)",
        category: "gmp",
        fileUrl: "/downloads/WHO_cGMP_certificate.pdf",
        fileSize: "265 KB",
        issuingAuthority: "State Licensing Authority & Drug Control Dept.",
        description:
          "Current Good Manufacturing Practice certificate validating cleanrooms, HVAC BMS, and validation protocols.",
      },
      {
        id: "u1-iso",
        name: "ISO 9001:2015 Certificate",
        unit: "Unit-I — Noida Sector-3",
        unitSubtitle: "Plant C-21, 22 & 23, Sector-3, Noida (U.P.)",
        category: "iso",
        fileUrl: "/downloads/NEW_ISO_VALIDITY_24.05.2023__1_.pdf",
        fileSize: "293 KB",
        issuingAuthority: "International Organization for Standardization (ISO)",
        description:
          "Quality Management Systems standard for formulation development, analytical QA/QC, and pharmaceutical manufacturing.",
      },
    ],
  },
  {
    id: "unit-2",
    name: "Unit-II — Roorkee",
    location: "Roorkee, Uttarakhand, India",
    subtitle: "Established 2006 • High-Capacity Solid & Liquid Production",
    description:
      "Purpose-built pharmaceutical manufacturing unit in Uttarakhand specializing in high-speed compression, encapsulation, and dry syrup formulations.",
    certificates: [
      {
        id: "u2-form-25",
        name: "Form 25 (Manufacturing Licence)",
        unit: "Unit-II — Roorkee",
        unitSubtitle: "Roorkee, Uttarakhand",
        category: "licence",
        fileUrl: "/downloads/Mfg._license_form_25.pdf",
        fileSize: "403 KB",
        issuingAuthority: "State Drug Licensing Authority Uttarakhand",
        description:
          "Manufacturing Licence Form 25 for solid orals and general pharmaceutical formulations at the Roorkee plant.",
      },
      {
        id: "u2-form-28",
        name: "Form 28 (Manufacturing Licence)",
        unit: "Unit-II — Roorkee",
        unitSubtitle: "Roorkee, Uttarakhand",
        category: "licence",
        fileUrl: "/downloads/Mfg._license_form_28.pdf",
        fileSize: "403 KB",
        issuingAuthority: "State Drug Licensing Authority Uttarakhand",
        description:
          "Manufacturing Licence Form 28 for Schedule C & C(1) formulations at the Roorkee facility.",
      },
      {
        id: "u2-who-gmp",
        name: "WHO-GMP Certificate",
        unit: "Unit-II — Roorkee",
        unitSubtitle: "Roorkee, Uttarakhand",
        category: "gmp",
        fileUrl: "/downloads/MANUFACTURING_ROORKEE.pdf",
        fileSize: "1.6 MB",
        issuingAuthority: "Directorate of Health & Family Welfare / FDA",
        description:
          "Official WHO-GMP and manufacturing approval validating production standards and quality systems for Roorkee Unit-II.",
      },
      {
        id: "u2-who-cgmp",
        name: "WHO cGMP Certificate",
        unit: "Unit-II — Roorkee",
        unitSubtitle: "Roorkee, Uttarakhand",
        category: "gmp",
        fileUrl: "/downloads/WHO_cGMP_certificate.pdf",
        fileSize: "265 KB",
        issuingAuthority: "World Health Organization Compliance Board",
        description:
          "Certification of current Good Manufacturing Practices adherence across tablet, capsule and liquid packaging suites.",
      },
      {
        id: "u2-iso",
        name: "ISO 9001:2015 Certificate",
        unit: "Unit-II — Roorkee",
        unitSubtitle: "Roorkee, Uttarakhand",
        category: "iso",
        fileUrl: "/downloads/NEW_ISO_VALIDITY_24.05.2023__1_.pdf",
        fileSize: "293 KB",
        issuingAuthority: "International Organization for Standardization (ISO)",
        description:
          "Quality standard for manufacturing operations, batch traceabilities, and product safety protocols.",
      },
    ],
  },
  {
    id: "unit-3",
    name: "Unit-III — Greater Noida",
    location: "Ecotech Extension, Greater Noida, Uttar Pradesh",
    subtitle: "Modern OSD Facility • Built to PIC/S, EU & USFDA Standards",
    description:
      "State-of-the-art oral solid dosage facility with automated high-speed compression, auto-coaters, and robotic packaging lines.",
    certificates: [
      {
        id: "u3-form-25",
        name: "Form 25 (Manufacturing Licence)",
        unit: "Unit-III — Greater Noida",
        unitSubtitle: "Greater Noida (U.P.)",
        category: "licence",
        fileUrl: "/downloads/Mfg._license_form_25.pdf",
        fileSize: "403 KB",
        issuingAuthority: "State Licensing Authority & FDA India",
        description:
          "Licence to manufacture for sale or distribution of non-Schedule X pharmaceutical formulations.",
      },
      {
        id: "u3-form-28",
        name: "Form 28 (Manufacturing Licence)",
        unit: "Unit-III — Greater Noida",
        unitSubtitle: "Greater Noida (U.P.)",
        category: "licence",
        fileUrl: "/downloads/Mfg._license_form_28.pdf",
        fileSize: "403 KB",
        issuingAuthority: "State Licensing Authority & FDA India",
        description:
          "Licence to manufacture for sale or distribution of Schedule C and C(1) advanced formulations.",
      },
      {
        id: "u3-who-gmp",
        name: "WHO-GMP Certificate",
        unit: "Unit-III — Greater Noida",
        unitSubtitle: "Greater Noida (U.P.)",
        category: "gmp",
        fileUrl: "/downloads/WHO_GMP_Certificate_Unit_1.pdf",
        fileSize: "350 KB",
        issuingAuthority: "World Health Organization Compliance Panel",
        description:
          "WHO-GMP certificate verifying PIC/S design, Class 100,000 cleanrooms, and automated closed-loop processes.",
      },
      {
        id: "u3-who-cgmp",
        name: "WHO cGMP Certificate",
        unit: "Unit-III — Greater Noida",
        unitSubtitle: "Greater Noida (U.P.)",
        category: "gmp",
        fileUrl: "/downloads/WHO_cGMP_certificate.pdf",
        fileSize: "265 KB",
        issuingAuthority: "Drug Controller General of India (DCGI) / State FDA",
        description:
          "cGMP compliance validation for high-speed tablet and capsule commercial production.",
      },
      {
        id: "u3-iso",
        name: "ISO 9001:2015 Certificate",
        unit: "Unit-III — Greater Noida",
        unitSubtitle: "Greater Noida (U.P.)",
        category: "iso",
        fileUrl: "/downloads/NEW_ISO_VALIDITY_24.05.2023__1_.pdf",
        fileSize: "293 KB",
        issuingAuthority: "International Organization for Standardization (ISO)",
        description:
          "Quality Management Systems accreditation for international export and contract manufacturing operations.",
      },
    ],
  },
];
