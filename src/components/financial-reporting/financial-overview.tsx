import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Box,
    Typography,
    Badge
} from '@mui/material';
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



const FinancialOverview: React.FC = () => {
    const overviewData = [
        {
            title: 'Total Sales',
            value: '14,732',
            change: '+4.2%',
            status: 'success',
            icon: 'ri-discount-percent-line',
            color: 'rgba(78, 191, 37, 0.9)', // Green background
            backgroundColor: 'rgba(78, 191, 37, 0.1)'

        },
        {
            title: 'Total Expenses',
            value: '$28,346.00',
            change: '+12.0%',
            status: 'success',
            icon: 'ri-receipt-line',
            color: 'rgba(251, 16, 61, 0.9)', // Red background
            backgroundColor: 'rgba(251, 16, 61, 0.1)'
        },
        {
            title: 'Total Visitors',
            value: '1,29,368',
            change: '-7.6%',
            status: 'danger',
            icon: 'ri-group-line',
            color: 'rgba(44, 121, 160, 0.9)', // blue background
            backgroundColor: 'rgba(44, 121, 160, 0.1)'
        },
        {
            title: 'Total Orders',
            value: '35,367',
            change: '+2.5%',
            status: 'success',
            icon: 'ri-shopping-cart-line',
            color: 'rgba(251, 16, 61, 0.9)', // purple background
            backgroundColor: 'rgba(251, 16, 61, 0.1)'
        },
    ];

    return (
        <Grid container spacing={3}>
            {overviewData.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                    <Card className="commonCard-2" sx={{ padding: 1 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            {(() => {
                                console.log('Debugging card content:', item.backgroundColor);
                                return null; // You must return a valid ReactNode
                            })()}
                            {/* Icon */}
                            <Box
                                className="icon-parent"
                                sx= {{
                                    color: item.color,
                                    backgroundColor: item.backgroundColor, // Set the background color here
                                    marginRight: 2,
                                    fontSize: 32,
                                    display: 'flex', // Ensure it's properly displayed
                                    justifyContent: 'center', // Center the icon horizontally
                                    alignItems: 'center', // Center the icon vertically
                                    width: 48, // Explicit width for the icon container
                                    height: 48, // Explicit height for the icon container
                                    borderRadius: '50%', // Make it circular
                                  }}
                            >
                                <i className={item.icon}></i>
                            </Box>

                            {/* Text Content */}
                            <Box>
                                <Typography variant="subtitle1" className="commonCard-2-heading">
                                    {item.title}
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    {item.value}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    className="commonCard-2-desc"
                                >
                                    {item.change.startsWith('-') ? 'Decreased by' : 'Increased by'}{' '}
                                    <StyledBadge
                                        badgeContent={item.change}
                                        className={`${item.status} ml-20`}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    />
                                    <br />
                                    this month
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};
export default FinancialOverview;