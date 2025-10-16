import React from 'react';
import { Box, Card, CardContent, Typography, Tabs, Tab, Button, Switch, FormControlLabel } from '@mui/material';

const SettingsPage: React.FC = () => {
  const [tab, setTab] = React.useState(0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Settings</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Settings" />
        <Tab label="Fees" />
      </Tabs>

      {tab === 0 && (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Dashboard Personalization</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Default Currency: USD</Typography>
                <Button variant="outlined">Update</Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Accounts Auto-creation</Typography>
              <FormControlLabel control={<Switch defaultChecked />} label="Auto-create Receiving Accounts at partner level" />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Bank Account</Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Payout Cycle</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Changes made here will apply only to test mode
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Daily</Typography>
                <Button variant="text">Edit</Button>
              </Box>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="body2">
                  Payouts will be made Daily. In case of public holiday, payouts will be made on the next working day.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained">Add Bank Account</Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {tab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6">Fees</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Configure fees here.</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SettingsPage;





