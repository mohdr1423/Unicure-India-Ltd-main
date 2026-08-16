import { useState } from "react";
import { MapPin, Phone, Mail, Navigation, ExternalLink } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

type UnitLocation = {
  id: string;
  name: string;
  unit: string;
  address: string;
  email: string;
  phone: string;
  embedUrl: string;
  mapLink: string;
  details: string;
};

const LOCATIONS: UnitLocation[] = [
  {
    id: "unit-1",
    unit: "Unit-I",
    name: "Noida Manufacturing Unit",
    address: "C-21, 22 & 23 Sector-3, Noida-201301, Distt. Gautam Buddha Nagar (U.P.)",
    email: "humanrealityofficial@gmail.com",
    phone: "8882674843",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.748293708571!2d77.31422737626922!3d28.584799075691065!2m3!1f0!f0!f0!m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce4598d9ef673%3A0xb36efebae8f0bf19!2sUnicure%20India%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    mapLink: "https://maps.google.com/?q=Unicure+India+Sector+3+Noida",
    details: "WHO-GMP Solid Orals, Liquids, External & Beta-Lactam suite",
  },
  {
    id: "unit-2",
    unit: "Unit-II",
    name: "Roorkee Manufacturing Unit",
    address:
      "Plot No. 46(B)/49B, Village Raipur, Bhagwanpur, Roorkee, Distt. Haridwar-247662, Uttarakhand",
    email: "humanrealityofficial@gmail.com",
    phone: "8882674843",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13809.5218764121!2d77.7950!3d29.9320!2m3!1f0!f0!f0!m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390eb3b76426cf1d%3A0x6b44a2c5a2c2c0a1!2sBhagwanpur%2C%20Roorkee%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    mapLink: "https://maps.google.com/?q=Bhagwanpur+Roorkee+Uttarakhand",
    details: "WHO-GMP Solid Orals, Dry Powders & Sex Hormone suite",
  },
  {
    id: "unit-3",
    unit: "Unit-III",
    name: "Greater Noida Manufacturing Unit",
    address:
      "Plot No. 112 & 113, Ecotech-12, Behind Greater Noida (West), Bishrakh, Gautam Buddha Nagar, UP-201310",
    email: "humanrealityofficial@gmail.com",
    phone: "8882674843",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14012.38573194098!2d77.4250!3d28.5950!2m3!1f0!f0!f0!m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cee0504bf1a35%3A0x7d819972322301c2!2sEcotech%2012%2C%20Greater%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    mapLink: "https://maps.google.com/?q=Ecotech+12+Greater+Noida+West",
    details: "State-of-the-art OSD facility built to PIC/S & EU-GMP standards",
  },
];

export function FacilityMap() {
  const [selectedId, setSelectedId] = useState<string>("unit-1");
  const activeUnit = LOCATIONS.find((l) => l.id === selectedId) ?? LOCATIONS[0];

  return (
    <section className="py-24 bg-gradient-soft">
      <div className="container-x">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary/40" />
              Locations & Facilities
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
              Interactive Facility Map
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Explore our three WHO-GMP certified manufacturing sites across Noida, Roorkee, and Greater Noida.
            </p>
          </div>
        </ScrollReveal>

        {/* Location Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedId(loc.id)}
              className={`flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold transition-all shadow-card ${
                selectedId === loc.id
                  ? "bg-primary text-white shadow-glow"
                  : "bg-white text-foreground hover:bg-secondary border border-border"
              }`}
            >
              <Navigation className="h-4 w-4" />
              <span>{loc.unit}</span>
              <span className="opacity-75 font-normal">({loc.name.split(" ")[0]})</span>
            </button>
          ))}
        </div>

        {/* Map & Info Card Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] items-stretch">
          {/* Active Unit Details Card */}
          <ScrollReveal variant="slide-left">
            <div className="rounded-3xl border border-border bg-white p-8 md:p-10 shadow-card flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                  {activeUnit.unit}
                </div>
                <h3 className="mt-4 text-2xl font-bold">{activeUnit.name}</h3>
                <p className="mt-2 text-sm text-primary font-medium">{activeUnit.details}</p>

                <div className="mt-8 space-y-4 text-sm text-muted-foreground">
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                    <span>{activeUnit.address}</span>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                    <span>{activeUnit.phone}</span>
                  </div>
                  <div className="flex gap-3">
                    <Mail className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                    <span>{activeUnit.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-3">
                <a
                  href={activeUnit.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition"
                >
                  Get Directions <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Embedded Google Map */}
          <ScrollReveal variant="slide-right" delay={0.1}>
            <div className="relative rounded-3xl border border-border bg-card overflow-hidden shadow-elegant h-[420px] lg:h-full min-h-[380px]">
              <iframe
                key={activeUnit.id}
                title={`Google Map - ${activeUnit.name}`}
                src={activeUnit.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
