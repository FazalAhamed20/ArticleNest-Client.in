import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { validationSchema } from '../validation/EditProfile';
import { AppDispatch } from '../../redux/Store';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { updateUserProfile } from '../../redux/actions/authAction';
import { categories } from '../common/categories';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phone: string;
  dateOfBirth: string;
  preferences: string[];
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}








const preferenceOptions = categories.map(category => ({
    value: category, // Keep the original case
    label: category,
  }));


const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user }) => {
  const dispatch: AppDispatch = useDispatch();
  console.log(user);
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <Formik
          initialValues={{
            ...user,
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
            preferences: user.preferences || [], 
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const userId =   useSelector((state: any) => state.auth.user?.user._id);
            console.log(values);
            
            await dispatch(updateUserProfile({ ...values, userId }));
            setSubmitting(false);
            onClose();
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 mb-1">First Name</label>
                <Field name="firstName" type="text" className="w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-700 mb-1">Last Name</label>
                <Field name="lastName" type="text" className="w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="col-span-2">
                <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                <Field name="email" type="email" className="w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>
            
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-1">Phone</label>
                <Field name="phone" as={PhoneInput} className="w-full" />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-gray-700 mb-1">Date of Birth</label>
                <Field name="dateOfBirth" type="date" className="w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
    <label htmlFor="preferences" className="block text-gray-700 mb-1">Preferences</label>
    <Select
  name="preferences"
  options={preferenceOptions}
  isMulti
  value={preferenceOptions.filter(option => values.preferences.includes(option.value))}
  onChange={option => {
    const selectedValues = (option as any).map((opt: any) => opt.value);
    setFieldValue('preferences', selectedValues); // Update Formik state
  }}
  className="w-full"
/>
    <ErrorMessage name="preferences" component="div" className="text-red-500 text-sm" />
  </div>
              <div className="col-span-2 flex justify-end mt-4">
                <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-gray-500 text-white rounded">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfileModal;
