import type { CandidateExtract } from "../types/candidate";

const TECH_SKILLS = [
  "Java",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "NestJS",
  "Express",
  "Python",
  "Go",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Git",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "HTML",
  "CSS",
  "Tailwind",
  "Spring",
  "Hibernate",
];

const SOFT_SKILLS = [
  "comunicación",
  "trabajo en equipo",
  "liderazgo",
  "proactividad",
  "responsabilidad",
  "organización",
  "adaptabilidad",
  "resolución de problemas",
];

const LANGUAGES = [
  "inglés",
  "español",
  "portugués",
  "francés",
  "italiano",
  "alemán",
];

export function parseCvData(rawText: string): CandidateExtract {
  const email = extractEmail(rawText);
  const phone = extractPhone(rawText);
  const fullName = extractPossibleName(rawText);
  const technicalSkills = extractMatches(rawText, TECH_SKILLS);
  const softSkills = extractMatches(rawText, SOFT_SKILLS);
  const languages = extractMatches(rawText, LANGUAGES);

  const experienceSection = extractSection(rawText, [
    "experiencia",
    "experiencia laboral",
    "experiencia profesional",
    "work experience",
  ]);

  const educationSection = extractSection(rawText, [
    "educación",
    "formación",
    "formación académica",
    "estudios",
    "education",
  ]);

  return {
    fullName,
    email,
    phone,
    location: undefined,
    technicalSkills,
    softSkills,
    languages,
    experience: experienceSection
      ? [
          {
            description: experienceSection,
          },
        ]
      : [],
    education: educationSection
      ? [
          {
            title: educationSection,
          },
        ]
      : [],
    rawText,
  };
}

function extractEmail(text: string): string | undefined {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
}

function extractPhone(text: string): string | undefined {
  return text.match(/(\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim();
}

function extractPossibleName(text: string): string | undefined {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.find((line) => {
    const lower = line.toLowerCase();

    const looksLikeContact =
      lower.includes("@") ||
      lower.includes("linkedin") ||
      lower.includes("github") ||
      lower.includes("tel") ||
      lower.includes("email") ||
      /\d/.test(line);

    return !looksLikeContact && line.length >= 3 && line.length <= 60;
  });
}

function extractMatches(text: string, values: string[]): string[] {
  const lowerText = text.toLowerCase();

  return values.filter((value) => lowerText.includes(value.toLowerCase()));
}

function extractSection(text: string, sectionNames: string[]): string | undefined {
  const lowerText = text.toLowerCase();

  const startIndex = sectionNames
    .map((section) => lowerText.indexOf(section.toLowerCase()))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (startIndex === undefined) {
    return undefined;
  }

  const sectionText = text.slice(startIndex);

  return sectionText.slice(0, 1500).trim();
}