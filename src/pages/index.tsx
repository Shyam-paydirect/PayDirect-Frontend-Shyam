import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/login-signup',
      permanent: false, // Set to true for a permanent redirect (HTTP 308)
    },
  };
};

const HomePage = () => {
  return null; // This won't render because of the redirect
};

export default HomePage;
