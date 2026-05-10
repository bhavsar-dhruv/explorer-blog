import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

// ⚠️ Paste your ImgBB API key here
const IMGBB_API_KEY = "02f0a39680f635b8da152836159dfb52"; 

export default function ImageUploader({ onImageUpload }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Compress the image before uploading (Saves massive mobile data)
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);

      // 2. Prepare the data for ImgBB
      const formData = new FormData();
      formData.append('image', compressedFile);

      // 3. Send it to ImgBB
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // 4. Pass the final image URL back to your main CreatePost form
        onImageUpload(data.data.display_url);
      } else {
        throw new Error("ImgBB refused the upload.");
      }

    } catch (err) {
      console.error(err);
      setError("Failed to upload image. Please check your connection.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="my-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Attach a Photo
      </label>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        disabled={isUploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-orange-50 file:text-orange-700
          hover:file:bg-orange-100"
      />

      {isUploading && (
        <p className="mt-2 text-sm text-blue-600 animate-pulse">
          Compressing & Uploading...
        </p>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
