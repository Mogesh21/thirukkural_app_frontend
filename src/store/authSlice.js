import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'config/axiosConfig';

// Load the token from localStorage
const initialToken = localStorage.getItem('token') || '';

export const logIn = createAsyncThunk('auth/logIn', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/user/login', { credentials });
    if (response.data.message === 'success') {
      const token = response.data.authorization.split(' ')[1];
      localStorage.setItem('token', token);
      return {
        status: 'succeeded',
        email: credentials.email,
        password: credentials.password,
        token
      };
    } else {
      return rejectWithValue({ message: response.data.message });
    }
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { message: 'Login failed' });
  }
});

export const logOut = createAsyncThunk('auth/logOut', async (_, { dispatch }) => {
  localStorage.removeItem('token');
  dispatch(setInitialState());
});

export const setToken = (token) => ({
  type: 'SET_TOKEN',
  payload: token
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: '',
    password: '',
    token: initialToken,
    status: 'idle',
    error: null
  },
  reducers: {
    setInitialState: (state) => {
      state.username = '';
      state.password = '';
      state.token = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.username = action.payload.username;
        state.password = action.payload.password;
        state.token = action.payload.token;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.status = 'idle';
        state.username = '';
        state.password = '';
        state.token = '';
      });
  }
});

export const { setInitialState } = authSlice.actions;

export default authSlice.reducer;
