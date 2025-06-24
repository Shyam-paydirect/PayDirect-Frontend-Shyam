import Cookies from 'js-cookie';

export const getStagingApi = () => {
  const clientId = Cookies.get('clientId');
  return clientId?.includes('UAT') ? 'https://stage.paydirectgo.com:5000/api' : 'https://yoda.paydirectgo.com:5000/api';
};

export const liveApi = 'https://auth.paydirectgo.com:5000/api';
export const docsApi = 'https://dms.paydirectgo.com:3000/api';
export const testingApi = 'http://13.201.173.117:3000/api';
