import { Experiment } from '../../../features/experiments/models/experiment.model';

export const MOCK_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-101',
    name: 'Checkout Redesign',
    description: 'Test the simplified checkout experience.',
    status: 'RUNNING',
    owner: 'Alex Johnson',
    startDate: '',
    endDate: '',
  },
  {
    id: 'exp-102',
    name: 'Pricing Page Test',
    description: 'Compare annual and monthly pricing presentation.',
    status: 'DRAFT',
    owner: 'Sarah Miller',
    startDate: '',
    endDate: '',
  },
  {
    id: 'exp-103',
    name: 'Onboarding Flow',
    description: 'Measure completion rate for the new onboarding flow.',
    status: 'COMPLETED',
    owner: 'David Wilson',
    startDate: '',
    endDate: '',
  },
  {
    id: 'exp-104',
    name: 'Dashboard Navigation',
    description: 'Test simplified dashboard navigation.',
    status: 'RUNNING',
    owner: 'Alex Johnson',
    startDate: '',
    endDate: '',
  },
];
