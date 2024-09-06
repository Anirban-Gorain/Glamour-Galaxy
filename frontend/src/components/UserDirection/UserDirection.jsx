import React from "react";
import Modal from "@mui/material/Modal";
import UserDirectionContent from "./UserDirectionContent/UserDirectionContent";

export default function UserDirection() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        onClick={handleOpen}
        class="fixed z-50 right-5 bottom-5 px-2 py-1.5 text-white bg-[#224fe0] rounded-lg "
      >
        Direction
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <UserDirectionContent handleClose={handleClose} />
      </Modal>
    </>
  );
}
