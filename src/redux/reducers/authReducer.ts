
import { signUp,login,logout, resetPassword, updateUserProfile } from "../actions/authAction";
import { createSlice ,PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';


interface AuthState {
    user: any; 
    loading: boolean;
    error: string | null;
    message:string | null
  }
  

  const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    message:null
  };

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
     
    },
    extraReducers: (builder) => {
      builder
        .addCase(signUp.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(signUp.fulfilled, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.user = action.payload;
        
          state.error = null;
        })
        .addCase(signUp.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload?.message;
          toast.error(state.error)
          console.log(state.error);
          
          
        })
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.user = action.payload;
          
            state.error = null;
          })
          .addCase(login.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload?.message;
            toast.error(state.error)
            console.log(state.error);
            
            
          })
          .addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.user = null
          
          
            state.error = null;
          })
          .addCase(logout.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload?.message;
            toast.error(state.error)
            console.log(state.error);
            
            
          })
          .addCase(resetPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(resetPassword.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.user = action.payload;
            state.message=action.payload?.message,
            toast.success(state.message)
            state.error = null;
          })
          .addCase(resetPassword.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload?.message;
            toast.error(state.error)
            console.log(state.error);
            
            
          })
          .addCase(updateUserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.user = action.payload;
            state.message=action.payload?.message,
            toast.success(state.message)
            state.error = null;
          })
          .addCase(updateUserProfile.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload?.message;
            toast.error(state.error)
            console.log(state.error);
            
            
          })
    },
  });
  
 
  export const authReducer = authSlice.reducer;