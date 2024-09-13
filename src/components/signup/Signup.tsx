import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Lock, Eye, EyeOff } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { userSignupValidation } from "../../utils/validation/UserSignup";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ClipLoader } from "react-spinners";
import { categories } from "../../utils/common/categories";
import { useDispatch } from 'react-redux';
import { AppDispatch } from "../../redux/Store";
import {signUp} from '../../redux/actions/authAction'
import { useNavigate } from "react-router-dom";



type Category = (typeof categories)[number];

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
  preferences: Category[];
}

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  
  const togglePassword = (): void => setShowPassword(!showPassword);
  const toggleConfirmPassword = (): void =>
    setShowConfirmPassword(!showConfirmPassword);

  const initialValues: SignupFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    preferences: [],
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      console.log("values", values);
      const { confirmPassword, ...submitValues } = values;
      const response = await dispatch(signUp(submitValues));

      if (response.payload?.success == true) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Join Article Nest
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={userSignupValidation}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="text"
                    name="firstName"
                    id="firstName"
                    className={`focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${
                      errors.firstName && touched.firstName ? "border-red-500" : ""
                    }`}
                    placeholder="John"
                  />
                </div>
                <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div className="flex-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="text"
                    name="lastName"
                    id="lastName"
                    className={`focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${
                      errors.lastName && touched.lastName ? "border-red-500" : ""
                    }`}
                    placeholder="Doe"
                  />
                </div>
                <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className={`focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${
                    errors.email && touched.email ? "border-red-500" : ""
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
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
                    inputClass={`focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.phone && touched.phone ? "border-red-500" : ""
                    }`}
                    containerClass="mt-1"
                    onChange={(value) => setFieldValue('phone', value)}
                  />
                )}
              </Field>
              <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  className={`focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${
                    errors.dateOfBirth && touched.dateOfBirth ? "border-red-500" : ""
                  }`}
                />
              </div>
              <ErrorMessage name="dateOfBirth" component="div" className="mt-1 text-sm text-red-600" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className={`focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md ${
                    errors.password && touched.password ? "border-red-500" : ""
                  }`}
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
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  className={`focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md ${
                    errors.confirmPassword && touched.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button type="button" onClick={toggleConfirmPassword} className="focus:outline-none">
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const newPreferences = values.preferences.includes(category)
                        ? values.preferences.filter((p) => p !== category)
                        : [...values.preferences, category];
                      setFieldValue("preferences", newPreferences);
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      values.preferences.includes(category)
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
              <ErrorMessage name="preferences" component="div" className="mt-1 text-sm text-red-600" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
            >
              {loading ? (
                <ClipLoader color="#ffffff" loading={loading} size={20} />
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </Form>
        )}
      </Formik>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-gray-800 hover:text-gray-700">
          Log in
        </a>
      </p>
    </motion.div>
  </div>
);
};

export default Signup;