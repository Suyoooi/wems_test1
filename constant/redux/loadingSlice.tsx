import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading: boolean;
  modalOpen: boolean; // 새로운 상태 modalOpen 추가
}

const initialState: LoadingState = {
  isLoading: false,
  modalOpen: false, // modalOpen 상태 초기값 설정
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    openModal: (state) => {
      state.modalOpen = true;
    },
    closeModal: (state) => {
      state.modalOpen = false;
    },
  },
});

export const { startLoading, stopLoading, openModal, closeModal } =
  loadingSlice.actions;
export default loadingSlice.reducer;
