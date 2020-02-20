import { createModule } from 'typeless';
import { ConfirmModalSymbol } from './symbol';

// --- Actions ---
export const [handle, ConfirmModalActions, getConfirmModalState] = createModule(
  ConfirmModalSymbol
)
  .withActions({
    show: (title: string, description: string, buttons: ButtonType[]) => ({
      payload: { title, description, buttons },
    }),
    close: null,
    onResult: (result: string) => ({ payload: { result } }),
    setIsLoading: (loadingButton: string | null) => ({
      payload: { loadingButton },
    }),
    setError: (error: string | null) => ({ payload: { error } }),
  })
  .withState<ConfirmModalState>();

// --- Types ---
export interface ConfirmModalState {
  isOpened: boolean;
  loadingButton: string | null;
  title: string;
  description: string;
  buttons: ButtonType[];
  error: string | null;
}

type ButtonType = {
  text: string;
  value: string;
  type: 'primary' | 'secondary' | 'danger';
};
