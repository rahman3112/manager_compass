import type { EscalationContact, Faq, LearningMaterial, ResourceLink } from './category';

export interface GuideRequest {
  categoryId: string;
  situation: string;
}

export type GuideKind = 'Guide' | 'Escalate' | 'NoGuideFound';

export interface Guide {
  kind: GuideKind;
  escalationMessage?: string;
  noGuideMessage?: string;
  situation?: string;
  firstStep?: string;
  prepareSteps: string[];
  documentation: ResourceLink[];
  faqs: Faq[];
  learningMaterials: LearningMaterial[];
  contact?: EscalationContact;
}
