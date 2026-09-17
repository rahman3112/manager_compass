import type { EscalationContact, Faq, LearningMaterial, ResourceLink } from './category';

export interface GuideRequest {
  categoryId: string;
  situation: string;
  desiredOutcome?: string;
}

export interface Guide {
  title: string;
  isUrgentEscalation: boolean;
  situationSummary: string;
  desiredOutcome?: string;
  steps: string[];
  recommendedDocumentation: ResourceLink[];
  relevantFaqs: Faq[];
  learningMaterials: LearningMaterial[];
  escalation?: EscalationContact;
  guardrailNote: string;
}
