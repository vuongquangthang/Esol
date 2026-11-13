export type FeedbackTone = 'info' | 'success' | 'error';

type FeedbackDetail =
  | { kind: 'notice'; message: string; tone: FeedbackTone }
  | { kind: 'confirm'; message: string; resolve: (confirmed: boolean) => void };

const FEEDBACK_EVENT = 'esol:feedback';

const emit = (detail: FeedbackDetail) => {
  window.dispatchEvent(new CustomEvent<FeedbackDetail>(FEEDBACK_EVENT, { detail }));
};

export const notify = (message: string, tone: FeedbackTone = 'info') => {
  emit({ kind: 'notice', message, tone });
};

export const requestConfirmation = (message: string): Promise<boolean> =>
  new Promise((resolve) => {
    emit({ kind: 'confirm', message, resolve });
  });

export const subscribeToFeedback = (handler: (detail: FeedbackDetail) => void) => {
  const listener = (event: Event) => {
    handler((event as CustomEvent<FeedbackDetail>).detail);
  };
  window.addEventListener(FEEDBACK_EVENT, listener);
  return () => window.removeEventListener(FEEDBACK_EVENT, listener);
};

