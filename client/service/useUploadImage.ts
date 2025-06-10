import * as ImageManipulator from 'expo-image-manipulator';
import { useState } from 'react';
import { uploadSeagrassImage } from '../service/api';

export const useUploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadImage = async (imageUri: string) => {
    setLoading(true);
    setError(null);
    try {
    
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 640, height: 640 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      const fileUri = manipResult.uri;
      const fileName = fileUri.split('/').pop() ?? 'photo.jpg';

      const result = await uploadSeagrassImage(fileUri, fileName);

      return { result, fileUri };
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, uploadImage };
};