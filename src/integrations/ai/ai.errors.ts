// ai.errors.ts

export class AIBackendError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIBackendError';
  }
}
