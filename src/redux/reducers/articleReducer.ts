
import { addArticle  } from "../actions/articleAction";
import { createSlice ,PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';


interface ArticleState {
    data: any; 
    message:any
    loading: boolean;
    error: string | null;
  }
  

  const initialState: ArticleState = {
    data: null,
    loading: false,
    message:null,
    error: null,
  };

const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
     
    },
    extraReducers: (builder) => {
      builder
        .addCase(addArticle.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addArticle.fulfilled, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.data = action.payload;
          state.message=action.payload?.message
          toast.success(state.message)
          state.error = null;
        })
        .addCase(addArticle.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload?.message;
          toast.error(state.error)
          console.log(state.error);
          
          
        })
       
    },
  });
  
 
  export const articleReducer = articleSlice.reducer;