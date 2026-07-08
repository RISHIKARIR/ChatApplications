import { createUser } from "../models/userModel.js";
import { uploadTocloudinary } from "../utils/uploadToCloudinary.js";

export const ProfileSave = async (req, res) => {
  console.log("heloooooooooooooooooo");
  try {
    console.log("reqfile", req.body);

    const { email, name } = req.body;

    const updateFields = {};

    let Profile_img;
    if (Object.keys(req.file).length > 0) {
      Profile_img = await uploadTocloudinary(req.file.buffer, "profile-image");
    }

  

    if (Profile_img != null || Profile_img != undefined) {
      updateFields.Profile_img = Profile_img.url;
    }

    if (email.trim() != "" && name.trim() != "") {
      updateFields.email = email;
      updateFields.name = name;
    } else if (email.trim() != "") {
      updateFields.email = email;
    } else {
      updateFields.name = name;
    }

    const [affected] = await createUser.update(
      {
        ...updateFields,
      },
      {
        where: {
          id: req.user.id,
        },
      },
    );

    if ([affected] > 0) {
      return res.status(200).json({
        message: "Profile uploaded succesfully",
        success: true,
        data: updateFields,
      });
    }



  } catch (err) {
    console.log(err, "error hai");
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: err,
    });
  }
};
