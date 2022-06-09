import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = ({ message, delay, type }) => {
  return type === "error"
    ? toast.error(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        delay: delay,
      })
    : toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        delay: delay,
      });
};

export default Toast;
