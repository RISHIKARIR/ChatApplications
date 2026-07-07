export const Authme = async (req, res) => {
  try {
    const User = req.user;

    if (!User) {
      return res.status(401).json({
        message: "Unauthorized Access",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Data returned Successfully",
      success: true,
      User: {
        id: User.id,
        name: User.name,
        email: User.email,
        user_image : User.Profile_img
      },

    });

    
  } catch (err) {
    console.log(err, "error to dikha bde bhai");

    return res.status(500).json({
      message: "Something Went Wrong",
      success: false,
    });
  }
};
