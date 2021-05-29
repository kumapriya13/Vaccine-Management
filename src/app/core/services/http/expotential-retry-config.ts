import { RetryBackoffConfig } from 'backoff-rxjs';

export const expRetryConfig: RetryBackoffConfig = {
  initialInterval: 1000,
  maxInterval: 1000 * 60,
  shouldRetry: (error) => {
    return error?.status === 429;
  },
  backoffDelay: (iteration, initialInterval) => {
    return Math.pow(1.5, iteration) * initialInterval;
  },
};
