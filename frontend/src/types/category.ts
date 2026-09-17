export interface ResourceLink {
  title: string;
  url: string;
}

export interface LearningMaterial {
  title: string;
  url: string;
  type: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface EscalationContact {
  role: string;
  when: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultSituation: string;
  defaultDesiredOutcome: string;
  documentation: ResourceLink[];
  faqs: Faq[];
  learningMaterials: LearningMaterial[];
  escalation?: EscalationContact;
}
