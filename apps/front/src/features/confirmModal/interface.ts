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
    setIsLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
  })
  .withState<ConfirmModalState>();

// --- Types ---
export interface ConfirmModalState {
  isOpened: boolean;
  isLoading: boolean;
  title: string;
  description: string;
  buttons: ButtonType[];
}

type ButtonType = {
  text: string;
  value: string;
  type: 'primary' | 'secondary' | 'danger';
};
