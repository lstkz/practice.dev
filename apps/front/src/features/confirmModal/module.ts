import { ConfirmModalActions, ConfirmModalState, handle } from './interface';

// --- Epic ---
handle.epic();

// --- Reducer ---
const initialState: ConfirmModalState = {
  isOpened: false,
  loadingButton: null,
  title: '',
  description: '',
  buttons: [],
  error: null,
};

handle
  .reducer(initialState)
  .on(ConfirmModalActions.show, (state, { title, description, buttons }) => {
    state.isOpened = true;
    state.loadingButton = null;
    state.title = title;
    state.description = description;
    state.buttons = buttons;
  })
  .on(ConfirmModalActions.close, state => {
    state.isOpened = false;
  })
  .on(ConfirmModalActions.setIsLoading, (state, { loadingButton }) => {
    state.loadingButton = loadingButton;
  });

// --- Module ---
export function useConfirmModalModule() {
  handle();
}
