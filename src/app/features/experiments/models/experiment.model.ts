export type ExperimentStatus = 'DRAFT' | 'RUNNING' | 'COMPLETED';

export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: ExperimentStatus;
  owner: string;
  startDate: string | null;
  endDate: string | null;
}
export interface CreateExperimentRequest {
  name: string;
  description: string;
  status: ExperimentStatus;
  owner: string;
  trafficPercentage: number;
  startDate: string | null;
  endDate: string | null;
}

export type UpdateExperimentRequest = CreateExperimentRequest;
