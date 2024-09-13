export type Signup = {
  _id?:any;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    password: string;
    preferences?: string[];
  };





  export interface Article {
    author: string;
    _id?: any;
    id?: any;
    title?: string;
    content: string;
    date: string;
    description?: string;
    image?: File | string | null;
    tags: string[];
    category?: string;
    imagePreview?:any;
    likes:any;
    dislikes:any;
    blocks:any
  }