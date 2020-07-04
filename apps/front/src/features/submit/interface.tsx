import { createModule } from 'typeless';
import { SubmitSymbol } from './symbol';
import { SocketMessage, TestInfo, Submission } from 'shared';
import { TargetChallengeValues } from 'src/types';

export const [handle, SubmitActions, getSubmitState] = createModule(
  SubmitSymbol
)
  .withState<SubmitState>()
  .withActions({
    $init: null,
    reset: null,
    show: null,
    commitShow: null,
    close: null,
    connect: null,
    connected: null,
    disconnect: null,
    retry: null,
    started: null,
    initTarget: (target: TargetChallengeValues) => ({ payload: { target } }),
    testingDone: (success: boolean) => ({ payload: { success } }),
    setError: (error: string | null) => ({ payload: { error } }),
    socketMessages: (messages: SocketMessage[]) => ({ payload: { messages } }),
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    setSubmissionId: (submissionId: string) => ({ payload: { submissionId } }),
    newSubmission: (submission: Submission) => ({
      payload: { submission },
    }),
  });

export type SubmitStatus = 'none' | 'submitting' | 'testing' | 'done';

// --- Types ---
export interface SubmitState {
  isOpened: boolean;
  status: SubmitStatus;
  error: string | null;
  tests: TestInfo[];
  result: 'PASS' | 'FAIL' | null;
  submissionId: string | null;
  started: Date | null;
  isSubmitting: boolean;
  target: TargetChallengeValues;
}
