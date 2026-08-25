/**
 * Centralized Executive Leadership Data Structure
 * Single source of truth for all leadership profiles, approved photos, designations, and quotes.
 */

export interface ExecutiveLeader {
  id: "abdul-mateen" | "amin-ul-aziz" | "kashish-aziz";
  name: string;
  designation: string;
  photo: string;
  altText: string;
  href: string;
  shortBio: string;
  quote: string;
  email: string;
  linkedin: string;
}

export const EXECUTIVE_LEADERS: ExecutiveLeader[] = [
  {
    id: "abdul-mateen",
    name: "Mr. Abdul Mateen",
    designation: "Managing Director",
    photo: "/images/executives/abdul-mateen.webp",
    altText: "Mr. Abdul Mateen — Managing Director",
    href: "/md-message",
    shortBio:
      "Founder and visionary leader guiding Unicure India across four decades of pharmaceutical manufacturing excellence, innovation, and global expansion.",
    quote:
      "When I look back upon the last 4 decades, I feel proud to observe the heights Unicure as a Company has achieved in the field of pharmaceuticals manufacturing and innovations. With joint dedicated endeavours from our team, we have realized the sole aim with which the company was established - to serve the country and mankind at large.\n\nIntegrity and ingenuity are the strength and core values of Unicure. By upholding these principles throughout the decades, we simultaneously function for the growth and value creation of our stakeholders. Working aggressively towards exports, Unicure is marching forward steadfastly into a brighter and wider horizon beyond the bounds of our Country.",
    email: "unicure@unicureindia.com",
    linkedin: "https://www.linkedin.com/company/unicure-india-ltd/",
  },
  {
    id: "amin-ul-aziz",
    name: "Mr. Amin Ul Aziz",
    designation: "Vice President of Business Development",
    photo: "/images/executives/amin-ul-aziz.webp",
    altText: "Mr. Amin Ul Aziz — Vice President of Business Development",
    href: "/leadership#amin",
    shortBio:
      "Leading strategic commercial partnerships, institutional distribution networks, and international market penetration across 20+ countries.",
    quote:
      "Don't stress about not having it all figured out. Social media can make us think that we're the only one not 'trending up and to the right.' Focus intently on where you are now and use this as leverage while everyone else is focused on projecting where they want to be rather than where they actually are.",
    email: "inquiries@unicureindia.com",
    linkedin: "https://www.linkedin.com/company/unicure-india-ltd/",
  },
  {
    id: "kashish-aziz",
    name: "Dr. Kashish Aziz",
    designation: "Vice President of Quality Assurance",
    photo: "/images/executives/kashish-aziz.webp",
    altText: "Dr. Kashish Aziz — Vice President of Quality Assurance",
    href: "/leadership#kashish",
    shortBio:
      "Championing zero-compromise cGMP compliance, rigorous analytical validation, and global regulatory excellence across all manufacturing blocks.",
    quote:
      "The entire pharmaceutical industry has a lot of work to do to restore public health. Quality is never an accident; it is always the result of high intention, sincere effort, intelligent direction and skillful execution. It represents the wise choice of many alternatives. Only a healthy horse can pull a sturdy wagon. Hence, my coherent message to team Unicure is: Quality or Quit!",
    email: "quality@unicureindia.com",
    linkedin: "https://www.linkedin.com/company/unicure-india-ltd/",
  },
];

/** Helper to get leader by ID */
export function getLeaderById(id: string): ExecutiveLeader | undefined {
  return EXECUTIVE_LEADERS.find((l) => l.id === id);
}

/** Helper to get other leaders */
export function getOtherLeaders(excludeId: string): ExecutiveLeader[] {
  return EXECUTIVE_LEADERS.filter((l) => l.id !== excludeId);
}
