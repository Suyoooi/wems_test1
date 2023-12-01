import { LanguageType } from "@/hook/useMultilingual";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  lang: LanguageType;
}

const initialState: ModalState = {
  lang: "ko",
};

const langSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    koLang: (state) => {
      state.lang = "ko";
    },
    enLang: (state) => {
      state.lang = "en";
    },
  },
});

export const { koLang, enLang } = langSlice.actions;
export default langSlice.reducer;
