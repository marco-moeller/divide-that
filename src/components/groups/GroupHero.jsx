import { HiOutlineCog8Tooth } from "react-icons/hi2";
import BackButton from "../layout/BackButton";
import useModal from "../../hooks/useModal";
import GroupSettingsModal from "./GroupSettingsModal";
import Modal from "../modals/Modal";
import { useAuth } from "../../context/AuthContext";

function GroupHero({ group }) {
  const { toggle, isShowing } = useModal();
  const { user } = useAuth();

  return (
    <>
      <header className="group-hero">
        <div className="hero-bg">
          <BackButton />
          <h1>{group.name}</h1>
          {group.creator === user.id && <HiOutlineCog8Tooth onClick={toggle} />}
          {group.creator !== user.id && <p></p>}
        </div>
      </header>
      {isShowing && (
        <Modal>
          <GroupSettingsModal toggle={toggle} group={group} />
        </Modal>
      )}
    </>
  );
}

export default GroupHero;
