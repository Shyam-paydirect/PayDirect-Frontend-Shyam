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

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
};

export default MyApp;
