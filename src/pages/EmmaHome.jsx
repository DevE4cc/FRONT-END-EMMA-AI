import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import useSession from "../hooks/useSession";

export const EmmaHome = () => {
  const [openModal, setOpenModal] = useState(false);
  const { logout } = useSession();
  return (
    <div className="w-[100%] h-[100%] relative">
      <div
        onClick={() => setOpenModal(true)}
        className="absolute top-4 right-4 text-white aspect-square h-[2rem] flex justify-center items-center text-xl cursor-pointer"
      >
        <i className="fa-solid fa-right-from-bracket"></i>
      </div>
      <div className="absolute flex flex-col sm:flex-row top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Link to="/chat">
          <div className="aspect-square mr-0 mb-4 sm:mr-4 sm:mb-0 flex flex-col justify-center items-center bg-white w-[15rem] h-[15rem] rounded-2xl drop-shadow-[0_25px_25px_rgba(255,255,255,0.25)] transition-all cursor-pointer hover:translate-y-[-10px]">
            <span className="font-bold text-2xl">
              Emma Chat
              <span className="ml-2">
                <i className="fa-solid fa-angle-right"></i>
              </span>
            </span>
          </div>
        </Link>
        <Link to="/conversation">
          <div className="aspect-square flex justify-center items-center bg-white w-[15rem] h-[15rem] rounded-2xl drop-shadow-[0_25px_25px_rgba(255,255,255,0.25)] transition-all cursor-pointer hover:translate-y-[-10px]">
            <span className="font-bold text-2xl">
              Emma
              <br />
              Conversations
              <span className="ml-2">
                <i className="fa-solid fa-angle-right"></i>
              </span>
            </span>
          </div>
        </Link>
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure to log out?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => logout()}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
