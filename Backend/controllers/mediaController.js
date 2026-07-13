import { uploadTocloudinary } from "../utils/uploadToCloudinary.js";

export const uploadMedia = async (req, res) => {
  const files = req.files;

  console.log(files,"jfiofoif")

  try {
    const uploadedFiles = await Promise.all(
      files.map((item) => uploadTocloudinary(item.buffer, "Message media")),
    );

    const allUploadedUrls = uploadedFiles.map((file)=>{
        return {
            url : file.url,
            resource_type : file.resource_type,
        }


    })

    return res.status(200).json({
      message: "Media uploaded sucessfull",
      success: true,
      urls: allUploadedUrls,
    });
  } catch (err) {
    console.log(err,"error")
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};
