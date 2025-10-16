import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '@/app/redux/store'; // Adjust the path based on your folder structure
import 'react-toastify/dist/ReactToastify.css';
import '../../public/assets/css/spacing.css'
import '../../public/assets/css/master.css'
import '../../public/assets/css/table.css'


import '../styles/global.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/app/theme';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      const reason: any = event.reason;
      const data = reason?.response?.data;
      const xMsg = Array.isArray(data?.xflow_errors) && data?.xflow_errors[0]?.message;
      const msg = xMsg || data?.message || data?.error || reason?.message || 'An error occurred';
      try { toast.error(msg); } catch {}
    };
    const handleError = (event: ErrorEvent) => {
      // Prevent Next.js dev overlay from taking over
      event.preventDefault();
      try { toast.error(event.message || 'An error occurred'); } catch {}
      return true;
    };
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
};

export default MyApp;
