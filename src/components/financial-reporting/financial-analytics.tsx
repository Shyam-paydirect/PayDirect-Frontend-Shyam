import React, { useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Badge,
} from '@mui/material';
import ApexCharts from 'apexcharts';
import Retool from 'react-retool';


// const StyledBadge = styled(Badge)(({ theme }) => ({
//   '& .MuiBadge-badge': {
//     // margin: '0.2rem 0.4rem', // Padding for size
//     fontSize: '0.6rem', // Small text size
//     fontWeight: 700, // Medium weight
//     borderRadius: '0.25rem', // Rounded edges
//     lineHeight: 0.5,
//     textAlign: 'center',
//     // color: '#fff', // Default white text
//   },
//   '&.success .MuiBadge-badge': {
//     color: 'rgba(78, 191, 37, 0.9)', // Green background
//     backgroundColor: 'rgba(78, 191, 37, 0.1)'
//   },
//   '&.danger .MuiBadge-badge': {
//     color: 'rgba(251, 16, 61, 0.9)', // Red background
//     backgroundColor: 'rgba(251, 16, 61, 0.1)'
//   },
// }));



const FinancialAnalytics: React.FC = () => {
  const authToken = 'retool_01jj4x18zf1e2xt7sm41f04v3e'; // Replace with your current token
  const url = `https://paydirectgoprod.retool.com/apps/Test-App?authToken=${authToken}`; // Include the token in the URL
  // React.useEffect(() => {
  //   const options = {
  //     series: [
  //       {
  //         name: 'Earnings',
  //         data: [20, 30, 45, 60, 100, 50, 40, 30, 20, 70, 90, 30],
  //       },
  //     ],
  //     chart: {
  //       type: 'bar',
  //       height: 200,
  //     },
  //     xaxis: {
  //       categories: [
  //         'Jan',
  //         'Feb',
  //         'Mar',
  //         'Apr',
  //         'May',
  //         'Jun',
  //         'Jul',
  //         'Aug',
  //         'Sep',
  //         'Oct',
  //         'Nov',
  //         'Dec',
  //       ],
  //     },
  //     yaxis: {
  //       max: 120,
  //       min: 0,
  //     },
  //     colors: ['#7366ff'],
  //     plotOptions: {
  //       bar: {
  //         columnWidth: '25%',
  //         borderRadius: 6,
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //   };

  //   const chart = new ApexCharts(document.querySelector('#chart'), options);
  //   chart.render();

  //   return () => {
  //     chart.destroy();
  //   };
  // }, []);

  return (
    <Card className="commonCard-2" sx={{ padding: 2 }}>
      {/* <iframe
        src="https://paydirectgoprod.retool.com/apps/Test-App?authToken=retool_01jj4x18zf1e2xt7sm41f04v3e"
        width="100%"
        height="460px">
      </iframe> */}

      <Retool
      height='800px'
        url={url}
        onData={(data) => {
          console.log('Data received from Retool:', data);
          // Handle data returned from Retool
        }}
      />

    </Card>
  );
};

export default FinancialAnalytics;