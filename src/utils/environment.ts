import Cookies from 'js-cookie';

export const isUATEnvironment = (): boolean => {
  const clientId = Cookies.get('clientId');
  return clientId ? clientId.includes('UAT') : false;
};