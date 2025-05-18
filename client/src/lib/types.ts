import { Feature, FeatureStatus } from "@shared/schema";

export interface FeatureCardProps {
  feature: Feature;
  onVote: (id: number) => void;
  hasVoted: boolean;
}

export interface AddFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string) => void;
}

export interface FeatureSortOption {
  value: 'most-voted' | 'newest' | 'oldest';
  label: string;
}

export interface FeatureFilterOption {
  value: 'all' | FeatureStatus;
  label: string;
}

export interface FeatureListProps {
  features: Feature[];
  onVote: (id: number) => void;
  votedFeatures: Record<number, boolean>;
}

export interface HeroProps {
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

export interface HeaderProps {
  onAddFeatureClick: () => void;
}

export const SORT_OPTIONS: FeatureSortOption[] = [
  { value: 'most-voted', label: 'Most Voted' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' }
];

export const FILTER_OPTIONS: FeatureFilterOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'approved', label: 'Approved' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' }
];

export const STATUS_COLORS: Record<FeatureStatus, string> = {
  'pending': 'bg-pending text-yellow-800',
  'in-progress': 'bg-in-progress text-blue-800',
  'approved': 'bg-approved text-green-800',
  'done': 'bg-done text-green-800',
  'canceled': 'bg-canceled text-red-800'
};

export const STATUS_LABELS: Record<FeatureStatus, string> = {
  'pending': 'Pending',
  'in-progress': 'In Progress',
  'approved': 'Approved',
  'done': 'Done',
  'canceled': 'Canceled'
};
