
import { createAsyncThunk} from '@reduxjs/toolkit';
import {  Signup } from '../../types/userData';
import baseAxios from '../../config/axiosInstance';


export const signUp = createAsyncThunk(
    'auth/signup',
    async (data:Signup, { rejectWithValue }) => {
      try {
        console.log(data);
        
        const response = await baseAxios.post('/signup', data,);
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );
  export const login = createAsyncThunk(
    'auth/login',
    async (data:Signup, { rejectWithValue }) => {
      try {
        console.log(data);
        
        const response = await baseAxios.post('/login', data,);
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );
  export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
      try {
     
        console.log(baseAxios);
        
        const response = await baseAxios.post('/logout');
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );

  export const resetPassword = createAsyncThunk(
    'auth/reset-password',
    async (data:any, { rejectWithValue }) => {
      try {
     
        console.log(data);
        
        const response = await baseAxios.post('/reset-password',{data});
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );

  export const updateUserProfile = createAsyncThunk(
    'auth/update-profile',
    async (data:any, { rejectWithValue }) => {
      try {
     
        console.log(data);
        
        const response = await baseAxios.post('/update-profile',{data});
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );