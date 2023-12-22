import React, { useEffect, useState } from "react";
import { AppRouter } from "./AppRouter";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaArrowLeft } from "react-icons/fa6";
import useSession from "./hooks/useSession";

import EmmaTerms from "./pages/EmmaTerms";

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [terms, setTerms] = useState(false);

  const { isSession } = useSession("");

  const cancelModal = () => {
    setOpenModal(false);
    // redirect to google
    window.location.href = "https://www.google.com/";
  };
  return (
    <>
      <AppRouter />
      {isSession ? (
        <span className="absolute text-white text-xs bottom-4 left-[50%] translate-x-[-50%]">
          Made with ❤ by E4CC
        </span>
      ) : (
        <>
          <span className="absolute text-white text-xs bottom-4 right-[2rem] ">
            Made with ❤ by E4CC
          </span>
          <span
            onClick={() => setOpenModal(true)}
            className="absolute text-gray-400 text-xs bottom-4 left-[2rem] cursor-pointer z-10"
          >
            Terms and <span className="block sm:inline"></span> Conditions
          </span>

          <Modal
            show={openModal}
            size={terms ? "xl" : `sm`}
            onClose={() => {
              setOpenModal(false);
              setTerms(false)
            }}
            popup
          >
            <Modal.Header />
            <Modal.Body className="modal-contenedor">
              <div className="">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                {!terms ? (
                  <h3 className="text-center mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    By using our platform, you agree to our <span className="underline text-blue-500 cursor-pointer" onClick={() => setTerms(true)}>Terms and
                    Conditions.</span>
                  </h3>
                ) : (
                  <>
                  <FaArrowLeft className="text-3xl mb-4 cursor-pointer" onClick={() => setTerms(false)}/>
                  <EmmaTerms />
                  </>
                )}
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={() => setOpenModal(false)}>
                    {"Yes, I'm sure"}
                  </Button>
                  <Button color="gray" onClick={() => cancelModal()}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
}

export default App;
