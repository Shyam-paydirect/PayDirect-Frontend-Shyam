"use client"
import React, { useEffect, useState } from 'react';
import AccountDetails from './accounts-details';
import CurrencyTransactions from './currency-transaction';
import RecentPayments from './recent-payments';
import CurrencyExchanger from './currency-exchanger/currency-exchanger';
import './currency-management.css'

const CurrencyManagement: React.FC = () => {
    return (
     <div className='currency-management-parent'>
        <div className="left-section">
                <CurrencyTransactions />
                <RecentPayments />
            </div>
            <div className="right-section">
                <AccountDetails />
                <CurrencyExchanger book={false}/>
            </div>
     </div>
    )
}

export default CurrencyManagement;