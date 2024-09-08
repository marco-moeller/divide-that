import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";
import { imageDB } from "./firebase";

export const getImageFromDatabase = async (path) => {
  try {
    const imgRef = ref(imageDB, path);
    const url = await getDownloadURL(imgRef);
    return url;
  } catch (error) {
    console.log(error);
  }
};

export const uploadImageToDataBase = async (file, path) => {
  try {
    const imgRef = ref(imageDB, path);
    await uploadBytes(imgRef, file);
  } catch (error) {
    console.log(error);
  }
};

export const deleteImageFromDatabase = async (path) => {
  try {
    const imgRef = ref(imageDB, path);
    await deleteObject(imgRef);
  } catch (error) {
    console.log(error);
  }
};
