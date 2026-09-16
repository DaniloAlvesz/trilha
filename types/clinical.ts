export interface PatientResource {
  resourceType: "Patient";
  id: string;
  active: boolean;
  birthDate: string;
  identifier: string;
}

export interface EncounterResource {
  resourceType: "Encounter";
  id: string;
  status: "planned" | "arrived" | "finished" | "cancelled";
  class: "ambulatory" | "virtual";
  type: string;
  periodStart: string;
  periodEnd?: string;
  title: string;
  notes?: string;
}

export interface ObservationResource {
  resourceType: "Observation";
  id: string;
  subjectId: string;
  categoryCode: "symptom" | "emotional_state" | "vital_sign";
  codeSystem: "LOINC" | "SNOMED-CT";
  codeValue: string;
  valueString?: string;
  effectiveDateTime: string;
}

export interface MedicationStatementResource {
  resourceType: "MedicationStatement";
  id: string;
  subjectId: string;
  medicationCode: string;
  dosageText: string;
  totalSupply: number;
  pillsPerDay: number;
  dosesTaken: number;
  effectivePeriodStart: string;
}

export interface DocumentReferenceResource {
  resourceType: "DocumentReference";
  id: string;
  subjectId: string;
  typeCode: "clinical-photo";
  contentAttachmentUrl: string;
  created: string;
  description: string;
}

export interface CommunityThread {
  id: string;
  category: "HORMONIOTERAPIA" | "LINFEDEMA" | "RECONSTRUCAO" | "EMOCIONAL";
  authorBotanyAlias: string;
  title: string;
  body: string;
  createdAt: string;
  replyCount: number;
}

export interface CommunityReply {
  id: string;
  threadId: string;
  authorBotanyAlias: string;
  body: string;
  createdAt: string;
}

export interface MotorStatusPayload {
  motor1ReportReady: boolean;
  motor1NextEncounterDays: number | null;
  motor1NextEncounterDate: string | null;
  motor2SuggestedQuestions: string[];
  motor3SupplyDaysLeft: number;
  motor3CriticalAlert: boolean;
  motor3TotalSupply: number;
  motor3DosesTaken: number;
  motor4ScanxietyActive: boolean;
  motor4ExamType: string | null;
  motor4ExamDaysLeft: number | null;
}
