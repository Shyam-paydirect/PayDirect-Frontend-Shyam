import { isUATEnvironment } from './utils/environment';

// API URLs
const yodaApi = 'https://yoda.paydirectgo.com:5000/api';
const stageApi = 'https://stage.paydirectgo.com:5000/api';

// Initialize stagingApi with a default value
let stagingApi = stageApi;

// Function to update stagingApi based on environment
export const updateStagingApi = () => {
  stagingApi = isUATEnvironment() ? stageApi : yodaApi;
  console.log('Updated stagingApi to:', stagingApi);
};

const liveApi = 'https://auth.paydirectgo.com:5000/api';
const docsApi = 'https://dms.paydirectgo.com:3000/api';
const testingApi = 'http://13.201.173.117:3000/api';

export {
  stagingApi,
  liveApi,
  testingApi,
  docsApi
};
