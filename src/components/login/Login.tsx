import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/Store';
import { login } from '../../redux/actions/authAction';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface LoginProps {}

type LoginMethod = 'email' | 'phone';





interface FormValues {
  identifier: string;
 
  phone: string;
  password: string;
}

const Login: React.FC<LoginProps> = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = (): void => setShowPassword(!showPassword);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    identifier: Yup.lazy(() => {
      if (loginMethod === 'email') {
        return Yup.string().email('Invalid email').required('Email is required');
      } else {
        return Yup.string(); 
      }
    }),

    phone: Yup.lazy(() => {
      if (loginMethod === 'phone') {
        return Yup.string().required('Phone number is required');
      } else {
        return Yup.string();
      }
    }),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });
  

  const handleSubmit = async(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    console.log('Login attempt:', values);
    const response = await dispatch(login(values));
    console.log(response);
    if (response.payload?.success == true) {
      navigate('/dashboard');
    }
    
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Log in to Article Nest</h2>
        <Formik
          initialValues={{
            identifier: '',
            phone: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({  setFieldValue }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Login with</label>
                <div className="flex space-x-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                      loginMethod === 'email'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    Email
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                      loginMethod === 'phone'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    Phone
                  </motion.button>
                </div>
              </div>
              {loginMethod === 'email' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      name="identifier"
                      type="email"
                      className="focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="you@example.com"
                    />
                  </div>
                  <ErrorMessage name="identifier" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <Field name="phone">
                    {({ field }: { field: any }) => (
                      <PhoneInput
                        {...field}
                        country={'in'}
                        inputProps={{
                          name: 'phone',
                          required: true,
                          autoFocus: true
                        }}
                        inputClass="focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        containerClass="mt-1"
                        onChange={(value) => setFieldValue('phone', value)}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    className="focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md" 
                    placeholder="••••••••" 
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button type="button" onClick={togglePassword} className="focus:outline-none">
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sign in
              </motion.button>
            </Form>
          )}
        </Formik>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/" className="font-medium text-gray-800 hover:text-gray-700">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;