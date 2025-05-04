import axios from "axios";

import { stagingApi } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const COUNTRY_CODE_API = `${stagingApi}/account/countryCodeList`;

export interface CountryOption {
    id: number;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
  }

interface CountryCodeState {
    countryCodes: CountryOption[];
    loadingCode: boolean;
    errorCountry: string | null;
}

const initialState: CountryCodeState = {
    countryCodes: [],
    loadingCode: false,
    errorCountry: null,
};

export const countryCodeList = createAsyncThunk<
CountryOption[], string, { rejectValue: string }
>
(
    "countryCode/countryCodeList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${COUNTRY_CODE_API}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            return response.data.data || []
        }
        catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch country codes'
            );
        }
    }
)

const countryCodeSlice = createSlice({
    name: "countryCode",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Country Code Cases
            .addCase(countryCodeList.pending, (state) => {
                state.loadingCode = true;
                state.errorCountry = null;
            })
            .addCase(countryCodeList.fulfilled, (state, action) => {
                state.loadingCode = false;
                state.countryCodes = action.payload;
            })
            .addCase(countryCodeList.rejected, (state, action) => {
                state.loadingCode = false;
                state.errorCountry =
                    action.payload && typeof action.payload === "object"
                        ? (action.payload as any).message
                        : (action.payload as string);
            })
    }
})

export default countryCodeSlice.reducer;
