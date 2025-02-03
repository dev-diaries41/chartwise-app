import React, { useState, useEffect } from 'react';

const useUpload = () => {
    const [media, setMedia] = useState<string[]>([]);

      // Clean up Blob URLs (only for Blob URLs)
      useEffect(() => {
        return () => {
            media.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [media]);

    // Upload media and convert it to Base64
    const uploadMediaBase64 = async (files: File[]) => {
        const fileReaders = files.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.onerror = () => {
                    reject(new Error('File reading has failed'));
                };
                reader.readAsDataURL(file);
            });
        });

        try {
            const urls = await Promise.all(fileReaders);
            setMedia(urls);
        } catch (error) {
            console.error('Failed to read files:', error);
        }
    };

    const uploadMediaBlob = (files: File[]) => {
        const fileURLs = files.map(file => URL.createObjectURL(file));
        setMedia(fileURLs);
    };

    const removeMedia = (index: number) => {
        setMedia(prevMedia => {
            const updatedMedia = prevMedia.filter((_, i) => i !== index);
            const urlToRemove = prevMedia[index];

            // Revoke only if it's a Blob URL
            if (urlToRemove.startsWith('blob:')) {
                URL.revokeObjectURL(urlToRemove);
            }

            return updatedMedia;
        });
    };

    const removeAllMedia = () => {
        media.forEach(url => {
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);  // Revoke only Blob URLs
            }
        });
        setMedia([]);
    };

    return {
        media,
        uploadMediaBase64,
        uploadMediaBlob,
        removeMedia,
        removeAllMedia
    };
};

export default useUpload;
