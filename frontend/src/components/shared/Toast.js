import { toast } from "react-toastify";
export const toasty = ({ type, text }) => {
  if (type === "success") {
    toast.success(text, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      theme: "colored",
    });
  } else {
    toast.error("Error", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      theme: "colored",
    });
  }
};
