import { createModule } from 'typeless';
import { SubmitSymbol } from './symbol';
import { SocketMessage, TestInfo } from 'shared';

export const [handle, SubmitActions, getSubmitState] = createModule(
  SubmitSymbol
)
  .withState<SubmitState>()
  .withActions({
    $init: null,
    show: null,
    close: null,
    connect: null,
    connected: null,
    disconnect: null,
    retry: null,
    started: null,
    testingDone: (success: boolean) => ({ payload: { success } }),
    setError: (error: string | null) => ({ payload: { error } }),
    socketMessages: (messages: SocketMessage[]) => ({ payload: { messages } }),
    setIsSubmitting: (isSubmitting: boolean) => ({ payload: { isSubmitting } }),
    setSubmissionId: (submissionId: string) => ({ payload: { submissionId } }),
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
}
