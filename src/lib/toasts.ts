import { toast } from 'sonner';

const defaultToastDuration = 5000;

export const errorToast = (message = 'Something went wrong'): string | number =>
  toast.error(message, {
    duration: defaultToastDuration,
    style: {
      borderRadius: '0.5rem',
      background: 'rgb(239 68 68)',
      color: '#fff',
      fontSize: '0.9rem',
      fontFamily: 'inherit',
    },
  });

type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export const successToast = (message = 'Success', position?: ToastPosition): string | number =>
  toast.success(message, {
    duration: defaultToastDuration,
    style: {
      borderRadius: '0.5rem',
      background: 'rgb(164,220,135)',
      color: '#fff',
      fontSize: '0.9rem',
      fontFamily: 'inherit',
    },
    position: position ?? 'bottom-right',
  });
