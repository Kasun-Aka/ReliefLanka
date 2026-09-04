import { BadgeTone } from '../components/shared/Badge';
import {
  Availability,
  InventoryCategory,
  RequestStatus,
  Urgency } from
'../types/relief';

export function urgencyTone(urgency: Urgency): BadgeTone {
  if (urgency === 'High') return 'danger';
  if (urgency === 'Medium') return 'warning';
  return 'neutral';
}

export function requestStatusTone(status: RequestStatus): BadgeTone {
  return status === 'Fulfilled' ? 'success' : 'warning';
}

export function availabilityTone(availability: Availability): BadgeTone {
  return availability === 'Available' ? 'success' : 'brand';
}

export function categoryTone(category: InventoryCategory): BadgeTone {
  switch (category) {
    case 'Medicine':
      return 'danger';
    case 'Water':
      return 'brand';
    case 'Food':
      return 'success';
    case 'Clothing':
      return 'warning';
    default:
      return 'neutral';
  }
}

export function coverageTone(
coverage: 'Critical' | 'Strained' | 'Covered')
: BadgeTone {
  if (coverage === 'Critical') return 'danger';
  if (coverage === 'Strained') return 'warning';
  return 'success';
}