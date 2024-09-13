import * as Yup from 'yup';

export const userSignupValidation = Yup.object({
  firstName: Yup.string()
    .min(4, 'Name must be greater than 3 characters')
    .required('Please enter your name'),
    lastName: Yup.string()
    .min(4, 'Name must be greater than 3 characters')
    .required('Please enter your name'),
  email: Yup.string()
    .email('Invalid email format')
    .trim('The contact name cannot include leading and trailing spaces')
    .strict(true)
    .required('Please enter your email')
    .matches(/^[A-Z0-9]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email format'),
    phone: Yup.string()
    .matches(/^\d{10,15}$/, 'Phone number must be between 10 and 15 digits')
    .required('Phone number is required'),
    dateOfBirth: Yup.date().max(new Date(), 'Date of birth cannot be in the future').required('Date of birth is required'),

  password: Yup.string()
    .required('Please enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      '8 characters,uppercase letter,lowercase letter,number,special character',
    ),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
    preferences: Yup.array().min(1, 'Select at least one preference'),
  
});