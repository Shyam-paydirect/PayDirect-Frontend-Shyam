import React, { useEffect, useState } from 'react';
import AccountDetails from './accounts-details';
import CurrencyTransactions from './currency-transaction';
import RecentPayments from './recent-payments';
import CurrencyExchanger from './currency-exchanger/currency-exchanger';

const CurrencyManagement: React.FC = () => {
    return (
     <div className='currency-management-parent'>
        <CurrencyTransactions />
        <AccountDetails />
        <RecentPayments />
        <CurrencyExchanger />
     </div>
    )
}

export default CurrencyManagement;