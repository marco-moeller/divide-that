import { useEffect, useState } from "react";
import ModalHeader from "../modals/ModalHeader";
import { useAuth } from "../../context/AuthContext";
import { UploadProfileImage } from "../../API/profileImageAPI";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utility/imageCropping";
import { activityTypes, getNewActivity } from "../../utility/interfaces";
import { addNewActivityToDatabase } from "../../API/activitiesAPI";
import useError from "../error/useError";
import ErrorComponent from "../error/ErrorComponent";

function ProfileImageUpload({ toggleModal }) {
  const [file, setFile] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { user } = useAuth();
  const { error, setError } = useError();

  const handleSubmit = async () => {
    if (!file) return;
    try {
      const croppedImg = await handleCrop();

      if (!croppedImg) throw new Error("Error cropping image");

      const croppedFile = await urlToFile(croppedImg);

      if (!croppedFile) throw new Error("Error cropping image");

      await UploadProfileImage(croppedFile, user);
      await handleNewActivity();

      setError(null);
      toggleModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewActivity = async () => {
    const newActivity = getNewActivity({
      users: [user],
      type: activityTypes.updatedProfilePicture
    });
    addNewActivityToDatabase(newActivity);
  };

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onCropComplete = (croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
      setError(null);
      return croppedImg;
    } catch (error) {
      setError("Error cropping image:", error.message);
      return null;
    }
  };

  const urlToFile = async (blob) => {
    return new File([blob], file.name, { type: file.type });
  };

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageSrc(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  return (
    <>
      <ModalHeader toggleModal={toggleModal} handleSubmit={handleSubmit}>
        Upload your avatar
      </ModalHeader>
      <div className="profile-img-upload">
        <ErrorComponent>{error}</ErrorComponent>
        <input type="file" accept=".png, .jpg, .jpeg" onChange={handleChange} />

        {file && (
          <div className="profile-img-preview-wrapper">
            <Cropper
              image={imageSrc}
              crop={crop}
              aspect={1 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              showGrid={false}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileImageUpload;
