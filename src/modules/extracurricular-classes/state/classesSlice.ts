import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../lib/config';

export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/classes`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Error al obtener las clases');
    }
  }
);

export const createClass = createAsyncThunk('classes/createClass', async (newClass) => {
  const response = await axios.post(`${API_BASE_URL}/classes`, newClass);
  return response.data;
});

const classesSlice = createSlice({
  name: 'classes',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchClasses.rejected, (state) => {
        state.status = 'failed'
      })
  },
});

export default classesSlice.reducer;