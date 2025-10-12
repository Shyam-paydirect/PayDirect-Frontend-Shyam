import { useEffect } from 'react';
import { useRouter } from 'next/router';

const DebugPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the file upload debug page
    router.replace('/debug-file-upload');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      Redirecting to File Upload Debug Center...
    </div>
  );
};

export default DebugPage;

