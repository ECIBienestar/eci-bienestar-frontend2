import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EnrollmentState {
  userId: string;
  classId: string;
}

const initialState: EnrollmentState = {
  userId: '',
  classId: '',
};

export const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    setEnrollmentData: (state, action: PayloadAction<EnrollmentState>) => {
      state.userId = action.payload.userId;
      state.classId = action.payload.classId;
    },
    clearEnrollmentData: (state) => {
      state.userId = '';
      state.classId = '';
    },
  },
});

export const { setEnrollmentData, clearEnrollmentData } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;