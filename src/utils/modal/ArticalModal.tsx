import React, { useRef, useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Article } from '../../types/userData';
import { ClipLoader } from 'react-spinners';
import { categories } from '../common/categories';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Article) => void;
  article: Article | null;
  isLoading:any
}



const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  tags: Yup.string(),
  content: Yup.string().required('Content is required'),
});

const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, onClose, onSave, article ,isLoading}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (article?.image) {
      if (typeof article.image === 'string') {
        setImagePreview(article.image);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(article.image);
      }
    } else {
      setImagePreview(null);
    }
  }, [article]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFieldValue('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">
          {article ? 'Edit Article' : 'Add New Article'}
        </h2>
        <Formik
          initialValues={{
            title: article?.title || '',
            description: article?.description || '',
            category: article?.category || '',
            tags: article?.tags.join(', ') || '',
            content: article?.content || '',
            image: article?.image || null,
          }}
          validationSchema={validationSchema}
          onSubmit={async(values, { setSubmitting }) => {
            const tags = values.tags.split(',').map((tag) => tag.trim());
            const newArticle: Article = {
              ...article!,
              ...values,
              tags,
              image: values.image || imagePreview,
            };
            await onSave(newArticle);
            setImagePreview(null); 
            setSubmitting(false);
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="flex flex-col md:flex-row md:space-x-6">
              <div className="md:w-1/2 space-y-4">
                <div>
                  <Field
                    type="text"
                    name="title"
                    placeholder="Article Title"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="description"
                    placeholder="Article Description"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <Field
                    as="select"
                    name="category"
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
                </div>
                <Field
                  type="text"
                  name="tags"
                  placeholder="Tags (comma-separated)"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <div>
                  <input
                    type="file"
                    name="image"
                    ref={fileInputRef}
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                    accept="image/*"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover mt-2 rounded"
                    />
                  )}
                </div>
              </div>
              <div className="md:w-1/2 space-y-4 mt-4 md:mt-0">
                <div>
                  <Field
                    as="textarea"
                    name="content"
                    placeholder="Article Content"
                    className="w-full p-2 border border-gray-300 rounded h-64"
                  />
                  <ErrorMessage name="content" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
  type="submit"
  disabled={isSubmitting || isLoading}
  className={`px-4 py-2 rounded transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
    isLoading
      ? "bg-gray-600 text-white cursor-not-allowed"
      : "bg-gray-800 text-white hover:bg-gray-700"
  }`}
>
  {isLoading ? (
    <ClipLoader color="#ffffff" loading={isLoading} size={20} />
  ) : (
    "Save"
  )}
</button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ArticleModal;