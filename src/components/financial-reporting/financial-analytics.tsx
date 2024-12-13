import React, {useEffect} from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Badge,
  } from '@mui/material';
  import ApexCharts from 'apexcharts';
import { styled } from '@mui/material';

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        // margin: '0.2rem 0.4rem', // Padding for size
        fontSize: '0.6rem', // Small text size
        fontWeight: 700, // Medium weight
        borderRadius: '0.25rem', // Rounded edges
        lineHeight: 0.5,
        textAlign: 'center',
        // color: '#fff', // Default white text
    },
    '&.success .MuiBadge-badge': {
        color: 'rgba(78, 191, 37, 0.9)', // Green background
        backgroundColor: 'rgba(78, 191, 37, 0.1)'
    },
    '&.danger .MuiBadge-badge': {
        color: 'rgba(251, 16, 61, 0.9)', // Red background
        backgroundColor: 'rgba(251, 16, 61, 0.1)'
    },
}));



  const FinancialAnalytics: React.FC = () => {
    React.useEffect(() => {
      const options = {
        series: [
          {
            name: 'Earnings',
            data: [20, 30, 45, 60, 100, 50, 40, 30, 20, 70, 90, 30],
          },
        ],
        chart: {
          type: 'bar',
          height: 200,
        },
        xaxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
        },
        yaxis: {
          max: 120,
          min: 0,
        },
        colors: ['#7366ff'],
        plotOptions: {
          bar: {
            columnWidth: '25%',
            borderRadius: 6,
          },
        },
        dataLabels: {
          enabled: false,
        },
      };
  
      const chart = new ApexCharts(document.querySelector('#chart'), options);
      chart.render();
  
      return () => {
        chart.destroy();
      };
    }, []);
  
    return (
      <Card className="commonCard-2" sx={{ padding: 2 }}>
        <CardContent>
          <Typography variant="h6" className="card-header">
            Earnings
          </Typography>
          <hr />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" fontWeight="bold">
                First Half
              </Typography>
              <Typography variant="h6" color="green">
                $51.94k
                <StyledBadge className='ml-30 success' badgeContent={'+0.9%'} />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" fontWeight="bold">
                Top Gross
              </Typography>
              <Typography variant="h6" color="green">
                $18.32k
                <StyledBadge className='ml-30 success' badgeContent={'+0.39%'} />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" fontWeight="bold">
                Second Half
              </Typography>
              <Typography variant="h6" color="red">
                $38k
                <StyledBadge className='ml-30 danger' badgeContent={'-0.15%'} color="error" />
              </Typography>
            </Grid>
          </Grid>
          <Box id="chart" sx={{ width: '100%', minHeight: '215px' }}></Box>
        </CardContent>
      </Card>
    );
  };
  
  export default FinancialAnalytics;