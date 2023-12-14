import React, { useEffect, useState, useRef } from "react";
import { Label, TextInput, Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import useSession from "../hooks/useSession";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const EmmaLogin = () => {
  const loading = useRef(null);
  const [username, setUsername] = useState("");
  const { userData, isLoading, login, state } = useSession("");
  const handleSubmit = (event) => {
    event.preventDefault();
    login(username);
  };
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    state.map((item) => {
      if (item.current) {
        if (item.state === "loading") {
          loading.current = toast.loading("Please wait...");
        } else if (item.state === "error") {
          toast.update(loading.current, {
            render: () => (
              <div dangerouslySetInnerHTML={{ __html: item.mensaje }} />
            ),
            type: "error",
            isLoading: false,
            autoClose: 2000,
            progress: undefined,
            draggable: true,
            closeOnClick: true,
          });
        } else if (item.state === "success") {
          toast.update(loading.current, {
            render: () => (
              <div dangerouslySetInnerHTML={{ __html: item.mensaje }} />
            ),
            type: "success",
            isLoading: false,
            autoClose: 2000,
            progress: undefined,
            draggable: true,
            closeOnClick: true,
            onClose: () => {
              window.location.reload();
            },
          });
        }
      }
    });
  }, [state]);

  useEffect(() => {
    console.log(userData);
  }, []);

  return (
    <div className="w-full h-full p-4 relative overflow-hidden">
      <ToastContainer
        position="top-center"
        className="w-[80%] left-[50%] translate-x-[-50%] top-[2rem] rounded overflow-hidden relative"
      />
      <div className="absolute flex flex-col sm:flex-row top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="p-4 mr-0 mb-4 sm:mr-4 sm:mb-0 flex flex-col justify-center items-center bg-white w-[15rem]  rounded-2xl drop-shadow-[0_25px_25px_rgba(255,255,255,0.25)] transition-all">
          <span className="font-bold text-xl">Verifica tu usuario</span>
          <form onSubmit={handleSubmit}>
            <div className="max-w-md mt-4">
              <TextInput
                id="username"
                placeholder="username"
                addon="@"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" color="dark" className="w-full mt-4">
                Verificar
              </Button>
            </div>
            <div
              onClick={() => setOpenModal(true)}
              className="text-xs mt-2 text-gray-600 underline text-end cursor-pointer"
            >
              No recuerdas tu usuario?
            </div>
          </form>
        </div>
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
              Recuerda que puedes encontrar tu usuario en tu factura, o puedes
              pedírselo a tu coach.
            </h3>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
