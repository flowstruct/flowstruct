export type GenerationStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export type SiteGenerationSummary = {
  id: number;
  status: GenerationStatus;
  createdAt: string;
  createdBy: number | null;
  startedAt: string | null;
  completedAt: string | null;
};

export type SiteGeneration = SiteGenerationSummary & {
  fileCount: number | null;
  sizeBytes: number | null;
  errorMessage: string | null;
};