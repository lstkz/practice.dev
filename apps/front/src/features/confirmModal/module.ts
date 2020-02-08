import { ConfirmModalActions, ConfirmModalState, handle } from './interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: ConfirmModalState = {
  isOpened: false,
  isLoading: false,
  title: '',
  description: '',
  buttons: [],
};

handle
  .reducer(initialState)
  .on(ConfirmModalActions.show, (state, { title, description, buttons }) => {
    state.isOpened = true;
    state.isLoading = false;
    state.title = title;
    state.description = description;
    state.buttons = buttons;
  })
  .on(ConfirmModalActions.close, state => {
    state.isOpened = false;
  })
  .on(ConfirmModalActions.setIsLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  });

// --- Module ---
export function useConfirmModalModule() {
  handle();
}
