import { NextApiRequest, NextApiResponse } from 'next';
import { store } from '@/app/redux/store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Example of checking Redux store readiness
        const state = store.getState();
        const uiState = state.ui; // Assuming `ui` is a slice of the state
        const fxRateState = state.fxRate; // Assuming `fxRate` is a slice of the state
        const authState = state.auth;

        // Sample health checks
        const isReduxReady = Boolean(uiState && fxRateState && authState);
        const isDatabaseConnected = true; // Replace with your actual DB connection check
        const isThirdPartyServiceAvailable = true; // Replace with a real API/service ping check

        // Collect health status
        const healthStatus = {
            uptime: process.uptime(),
            status: 'ok',
            dependencies: {
                redux: isReduxReady,
                database: isDatabaseConnected,
                thirdPartyService: isThirdPartyServiceAvailable,
            },
            timestamp: new Date(),
        };

        if (isReduxReady && isDatabaseConnected && isThirdPartyServiceAvailable) {
            return res.status(200).json(healthStatus);
        } else {
            return res.status(500).json({ ...healthStatus, status: 'error' });
        }
    } catch (error) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'An unexpected error occurred'; // Handle unknown error type safely
        return res.status(500).json({
            status: 'error',
            message: 'Health check failed.',
            error: errorMessage,
        });
    }
}
