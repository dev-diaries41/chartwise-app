
// import {v2 as cloudinary, UploadApiOptions} from 'cloudinary';

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//     secure: true
//   });


//  // image: file path, base64 
// export async function upload(image: string, options?:  UploadApiOptions){
//     try{
//         const result = await cloudinary.uploader.upload(image, options);
//         return result.secure_url;
//     }catch(error: any){
//         console.error(`Error uploading image to cloudinary.The file ${image} was not uploaded.`)
//         throw error
//     }
// }

// export async function uploadMultiple(images: string[], options?: UploadApiOptions) {
//     try {
//       const uploadPromises = images.map(image => upload(image, options));
//       const urls = await Promise.all(uploadPromises);
//       return urls;
//     } catch (error: any) {
//       console.error('Error uploading multiple images to Cloudinary.');
//       throw error;
//     }
//   }
  

// export async function deleteFromCloudinary(publicId: string) {
//     try {
//         const result = await cloudinary.uploader.destroy(publicId);
//         if (result.result === 'ok') {
//             console.log(`File with public ID ${publicId} deleted successfully.`);
//             return true;
//         } else {
//             console.error(`Error deleting file from Cloudinary with public ID ${publicId}`);
//             return false;
//         }
//     } catch (error: any) {
//         console.error(`Error deleting file from Cloudinary with public ID ${publicId}: ${error}`);
//         throw error;
//     }
// }
