import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./Toast.css";
export const toastify = (type, text) => {
  let options = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
  }
  if (type === "success") {
    toast.success(text, {...options, className: 'success'});
  } else if (type === "error") {
    toast.error(text, {...options, className: 'error'});
  }
  else if (type === "info") {
    toast.info(text, {...options, className: 'info'});
  }
};