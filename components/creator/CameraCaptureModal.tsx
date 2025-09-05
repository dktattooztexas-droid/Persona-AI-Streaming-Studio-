import React from 'react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ isOpen, onClose, onCapture }) => {
  if (!isOpen) {
    return null;
  }

  // A full implementation would use libraries like react-webcam
  // to access the user's camera and capture an image.
  // This is a placeholder structure.

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-brand-surface p-6 rounded-lg shadow-xl">
        <h2 className="text-lg font-bold mb-4">Camera Capture</h2>
        <div className="w-96 h-72 bg-gray-900 flex items-center justify-center text-brand-text-dark rounded mb-4">
          Camera feed would appear here.
        </div>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
            Cancel
          </button>
          <button
            onClick={() => {
              // In a real app, this would be a base64 string from the camera.
              onCapture('mock-image-data');
              onClose();
            }}
            className="px-4 py-2 rounded bg-brand-primary hover:bg-brand-secondary"
          >
            Capture
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureModal;
