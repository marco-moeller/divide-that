import { nanoid } from "nanoid";
import {
  deleteImageFromDatabase,
  getImageFromDatabase,
  uploadImageToDataBase
} from "../database/profileImages";
import { addUserToDatabase } from "../database/user";

export const UploadProfileImage = async (file, user) => {
  const id = nanoid();
  const newStoragePath = "profileImages/" + id;
  try {
    await uploadImageToDataBase(file, newStoragePath);
    await addUserToDatabase({ ...user, profileImage: id });
    if (user.profileImage) {
      const oldStoragePath = "profileImages/" + user.profileImage;
      await deleteImageFromDatabase(oldStoragePath);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getProfileImage = async (id = "defaultAvatar.jpg") => {
  try {
    const path =
      id === "" ? "profileImages/defaultAvatar.jpg" : `profileImages/${id}`;
    const imgUrl = await getImageFromDatabase(path);
    return imgUrl;
  } catch (error) {
    console.log(error);
  }
};
