import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return <IoMdArrowBack onClick={handleClick} />;
}

export default BackButton;
