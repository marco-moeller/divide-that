import { useEffect, useState } from "react";
import ModalHeader from "../modals/ModalHeader";
import { useAuth } from "../../context/AuthContext";
import { UploadProfileImage } from "../../API/profileImageAPI";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utility/imageCropping";
import { activityTypes, getNewActivity } from "../../utility/interfaces";
import { addNewActivityToDatabase } from "../../API/activitiesAPI";

function ProfileImageUpload({ toggleModal }) {
  const [file, setFile] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!file) return;
    try {
      const croppedImg = await handleCrop();
      const croppedFile = await urlToFile(croppedImg);

      await UploadProfileImage(croppedFile, user);
      await handleNewActivity();

      toggleModal();
    } catch (error) {
      console.log(error);
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

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
      return croppedImg;
    } catch (error) {
      console.error("Error cropping image:", error);
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
