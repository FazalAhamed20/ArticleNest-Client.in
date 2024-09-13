import React from 'react';
import { ClipLoader } from 'react-spinners';

interface ConfirmationModalProps {
  showModal: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  isDelete: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  showModal, 
  onClose, 
  onConfirm, 
  message, 
  isDelete 
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg max-w-sm mx-auto p-4">
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded text-gray-800 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDelete}
            className={`px-4 py-2 rounded text-white ${
              isDelete 
                ? 'bg-red-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isDelete ? (
              <ClipLoader color="#ffffff" loading={true} size={20} />
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;