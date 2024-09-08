import { useState } from "react";
import ModalHeader from "../modals/ModalHeader";
import { useAuth } from "../../context/AuthContext";
import { UploadProfileImage } from "../../API/profileImageAPI";

function ProfileImageUpload({ toggleModal }) {
  const [file, setFile] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async () => {
    await UploadProfileImage(file, user);
    toggleModal();
  };

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <>
      <ModalHeader toggleModal={toggleModal} handleSubmit={handleSubmit}>
        Upload your avatar
      </ModalHeader>
      <div>
        <input type="file" accept=".png, .jpg, .jpeg" onChange={handleChange} />
      </div>
    </>
  );
}

export default ProfileImageUpload;
