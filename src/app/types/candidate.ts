export type CandidateExperience = {
  company?: string;
  role?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

export type CandidateEducation = {
  institution?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
};

export type CandidateExtract = {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  technicalSkills: string[];
  softSkills: string[];
  experience: CandidateExperience[];
  education: CandidateEducation[];
  languages: string[];
  rawText: string;
};