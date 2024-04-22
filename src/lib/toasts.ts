import { toast } from 'sonner';

export const errorToast = (message = 'Something went wrong'): string | number =>
  toast.error(message, {
    duration: 5000,
    style: {
      borderRadius: '0.5rem',
      background: 'rgb(239 68 68)',
      color: '#fff',
      fontSize: '0.9rem',
      fontFamily: 'inherit',
    },
  });

export const successToast = (message = 'Success'): string | number =>
  toast.success(message, {
    duration: 5000,
    style: {
      borderRadius: '0.5rem',
      background: 'rgb(164,220,135)',
      color: '#fff',
      fontSize: '0.9rem',
      fontFamily: 'inherit',
    },
  });
