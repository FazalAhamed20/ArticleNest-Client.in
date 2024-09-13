
import { createAsyncThunk} from '@reduxjs/toolkit';
import {  Article } from '../../types/userData';
import baseAxios from '../../config/axiosInstance';

export const addArticle = createAsyncThunk(
    'article/addArticle',
    async (data:Article, { rejectWithValue }) => {
      try {
        console.log(data);
        
        const response = await baseAxios.post('/add-article', data,);
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data); 
      }
    }
  );
