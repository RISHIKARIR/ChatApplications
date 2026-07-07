import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

export const uploadTocloudinary = (filebuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadstream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    Readable.from(filebuffer).pipe(uploadstream);
  });
};
