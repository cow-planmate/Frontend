import { toast, Slide } from "react-toastify";

export function ErrorToast(str) {
  return toast.error(str, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
    className: "font-pretendard text-gray-700 sm:w-[400px] break-keep",
  });
}

export function SuccessToast(str) {
  return toast.success(str, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
    className: "font-pretendard text-gray-700 sm:w-[400px] break-keep",
  });
}

export function WarningToast(str) {
  return toast.warning(str, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
    className: "font-pretendard text-gray-700 sm:w-[400px] break-keep",
  });
}