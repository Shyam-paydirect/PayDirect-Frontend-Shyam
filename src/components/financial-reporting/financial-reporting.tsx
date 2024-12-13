import React from 'react';
import {
    Container,
    Grid,
    Card, 
    CardContent,
    Typography
} from '@mui/material';

import FinancialAnalytics from './financial-analytics';
import FinancialOverview from './financial-overview';
import './financial-reporting.css'

const FinancialReporting: React.FC = () => {
    return (
      <Container className="financial-reporting-parent" sx={{ padding: 2, borderRadius: 1 }}>
        <Grid container spacing={3}>
          {/* Financial Overview Section */}
          <Grid item xs={12} lg={6}>
            <FinancialOverview />
          </Grid>
  
          {/* Financial Analytics Section */}
          <Grid item xs={12} lg={6}>
            <FinancialAnalytics />
          </Grid>
  
          {/* Bottom Full-Width Row: Table */}
          {/* <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Your table content goes here</Typography>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      </Container>
    );
  };
  

  export default FinancialReporting;