import type { User } from '../models/user';

export class GuestRestrictionError extends Error {
  constructor(public featureName: string) {
    super(`Tamu tidak dapat mengakses: ${featureName}`);
    this.name = 'GuestRestrictionError';
  }
}

export class CheckRestrictionUseCase {
  execute(user: User | null, actionDescription: string): void {
    if (!user || user.isGuest) {
      throw new GuestRestrictionError(actionDescription);
    }
  }
}
