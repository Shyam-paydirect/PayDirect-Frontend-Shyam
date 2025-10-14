import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies['token'];
  if (token) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }
  return {
    redirect: {
      destination: '/login-signup',
      permanent: false,
    },
  };
};

const HomePage = () => {
  return null;
};

export default HomePage;
