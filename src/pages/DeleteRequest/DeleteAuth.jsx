import { useState } from "@/shared/hooks";
import { LangSwitcher } from "@/shared/components";
import DeleteRequestForm from "./DeleteRequestForm";
import DeleteAccount from "./DeleteAccount";

const DeleteAuth = () => {
  const [showModal, setShowModal] = useState(
    sessionStorage.getItem("token") ? true : false
  );
  const toggleModal=(val)=>{
    setShowModal(val)
  }

  return (
    <main className="relative flex flex-col justify-center items-center h-screen w-screen bg-[#1F1F1F] text-white p-4">
      <div className="absolute top-10 end-10">
        <LangSwitcher />
      </div>
      {showModal ? (
        <DeleteAccount toggleModal={toggleModal}/>
      ) : (
        <DeleteRequestForm toggleModal={toggleModal} />
      )}
    </main>
  );
};

export default DeleteAuth;
