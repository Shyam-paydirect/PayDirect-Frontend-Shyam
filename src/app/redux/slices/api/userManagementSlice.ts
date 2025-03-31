import { liveApi } from "@/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface User {
    id: number;
    username: string;
    role: string;
    delete_flag: number;
    // add other user properties as needed
}

interface GetUsersResponse {
    errorCode: number;
    message: string;
    dataUsers: User[];
}

interface UserManagementState {
    users: User[];
    loading: boolean;
    error: string | null;
}

interface RemoveUserResponse {
    errorCode: number;
    message: string;
    // Optionally, include details about the removed user if returned
}

const initialState: UserManagementState = {
    users: [],
    loading: false,
    error: null,
};


export const inviteUser = createAsyncThunk<
    any, // Adjust response type if needed
    { email: string; role: string; merchant_id: string },
    { rejectValue: string }
>(
    "userManagement/inviteUser",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${liveApi}/users/inviteUser`, payload);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            return rejectWithValue(
                axiosError.response?.data.message || "Failed to invite user"
            );
        }
    }
);

export const changePassUser = createAsyncThunk<
    any, // Adjust response type if needed
    { role: string; id: string },
    { rejectValue: string }
>(
    "userManagement/changePassUser",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${liveApi}/users/resetUserPasswordByAdmin`, payload);
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            return rejectWithValue(
                axiosError.response?.data.message || "Failed to invite user"
            );
        }
    }
);

export const fetchUsersByMerchantId = createAsyncThunk<
    User[],
    string,
    { rejectValue: string }
>(
    "userManagement/fetchUsersByMerchantId",
    async (merchantId, { rejectWithValue }) => {
        try {
            const response = await axios.get<GetUsersResponse>(
                `${liveApi}/users/getAllUsersByMerchantId?merchant_id=${merchantId}`
            );
            if (response.data.errorCode !== 0) {
                return rejectWithValue(response.data.message || "Error fetching users");
            }
            return response.data.dataUsers;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            return rejectWithValue(
                axiosError.response?.data.message || "Failed to fetch users"
            );
        }
    }
);

export const removeUser = createAsyncThunk<
    RemoveUserResponse,
    { id: string; role?: string },
    { rejectValue: string }
>(
    "userManagement/removeUser",
    async ({ id, role = "admin" }, { rejectWithValue }) => {
        try {
            const response = await axios.post<RemoveUserResponse>(
                `${liveApi}/users/removeUser`,
                { id, role }
            );
            if (response.data.errorCode !== 0) {
                return rejectWithValue(response.data.message);
            }
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;
            return rejectWithValue(
                axiosError.response?.data.message || "Failed to remove user"
            );
        }
    }
);

const userManagementSlice = createSlice({
    name: "userManagement",
    initialState,
    reducers: {
        clearUsers: (state) => {
            state.users = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUsersByMerchantId.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUsersByMerchantId.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        });
        builder.addCase(fetchUsersByMerchantId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch users";
        });
        builder.addCase(inviteUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(inviteUser.fulfilled, (state, action) => {
            state.loading = false;
            // Optionally handle any changes here (e.g. push the new user to state)
        });
        builder.addCase(inviteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to invite user";
        });

        builder.addCase(removeUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removeUser.fulfilled, (state, action) => {
            state.loading = false;
            // Optionally, remove the user from the local state list.
            // For example, if the API returns the removed user's id, you could do:
            // state.users = state.users.filter((user) => user.id !== removedUserId);
        });
        builder.addCase(removeUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to remove user";
        });
    },
});

export const { clearUsers } = userManagementSlice.actions;
export default userManagementSlice.reducer;
