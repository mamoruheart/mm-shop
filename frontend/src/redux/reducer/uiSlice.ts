import { PayloadAction, createSlice } from '@reduxjs/toolkit';


interface UiState {
    isOpen: number,
    comState: string
}

const initialState: UiState = {
    isOpen: 0,
    comState: ''

};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
      toggleIsOpen(state) {
        state.isOpen = 1 - state.isOpen;
      },
      showIsOpen(state) {
        state.isOpen = 1;
      },
      hideIsOpen(state) {
        state.isOpen = 0;
      },
      setComState(state, action: PayloadAction<{newState: string}>){
        state.comState = action.payload.newState;
      }
      // Optionally add reducers for adding, updating, deleting products
    },
  });
  
  export const {
    hideIsOpen,
    showIsOpen,
    toggleIsOpen,
    setComState
  } = uiSlice.actions;
  
  export const uiReducer = uiSlice.reducer;
  