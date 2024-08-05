import React from "react";
import Modal from "@mui/material/Modal";

export default function Popup({ children, popupStyle, ...props }) {
  return (
    <Modal
      {...props}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={popupStyle}
    >
      {children}
    </Modal>
  );
}
