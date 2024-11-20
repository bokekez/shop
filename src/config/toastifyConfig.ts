import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
};

export const showToastifyError = (error: string, toastId?: string | number) =>
  toast.error(error, { ...defaultOptions, toastId });

export const showToastifySuccess = (message: string, toastId?: string | number) =>
  toast.success(message, { ...defaultOptions, toastId });

export const showToastifyWarning = (message: string, toastId?: string | number) =>
  toast.warning(message, { ...defaultOptions, toastId });
