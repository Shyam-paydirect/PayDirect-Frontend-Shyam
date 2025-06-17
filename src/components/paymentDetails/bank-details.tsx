import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    Modal,
    useMediaQuery,
    useTheme,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { saveBankDetails } from "@/app/redux/slices/paymentDetailsSlice";
import AccountSelectorModal from "./fetch-bank"; // Import the selector modal
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { createAccount } from "@/app/redux/slices/api/accountsSlice";
import { countryCodeList } from "@/app/redux/slices/api/countryCodeSlice";
import { RootState } from "@/app/redux/store";
import { AppDispatch } from "@/app/redux/store";
import CountryCodeDropdown from "@/pages/autocomplete";

interface CustomJwtPayload {
    username: string;
    id?: number;
}

const token = Cookies.get("token") || "";

let decodedToken: CustomJwtPayload | null = null; // Initialize with null

if (token !== "") {
    decodedToken = jwtDecode<CustomJwtPayload>(token); // Assign the decoded token
}
const userID = decodedToken?.id || 0;

interface BankDetailsProps {
    openModal: boolean;
    handleCloseModal: () => void;
}

const BankDetails: React.FC<BankDetailsProps> = ({
    openModal,
    handleCloseModal,
}) => {
    const dispatch = useDispatch();
    const dispat = useDispatch<AppDispatch>();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const wideFields = ['beneficiaryAccountNumber', 'beneficiaryBank', 'bankAddress', 'beneficiaryName', 'correspondentBankCharges', 'senderSwiftBic', 'receivingPartyCountryCode', 'senderPartyCountryCode']

    const [bankDetails, setBankDetails] = useState({
        swiftCode: "",
        beneficiaryBank: "",
        // branch: "",
        bankAddress: "",
        city: "",
        state: "",
        country: "",
        receivingPartyCountryCode: "",
        beneficiaryName: "",
        beneficiaryAccountNumber: "",
        senderName: '',
        senderAccNo: '',
        senderSwiftBic: '',
        senderPartyCountryCode: "",
        correspondentBankCharges: ""
    });

    useEffect(() => {
        dispat(countryCodeList(""));
    }, [dispat])

    const { countryCodes } = useSelector((state: RootState) => state.countryCode)
    const codes = countryCodes.map(c => ({
        name: c.name,
        code: c.code
    }))

    const [modalOpen, setModalOpen] = useState(false);
    const [accountType, setAccountType] = useState<"self" | "beneficiary">("self");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const mapAccountToSelf = (account: any) => {
        setBankDetails(prev => ({
            ...prev,
            senderName: account.name,
            senderAccNo: account.accountNo,
            senderSwiftBic: account.swiftBic,
            senderPartyCountryCode: account.countryCode || "",
        }))
    }

    const mapAccountToBankDetails = (account: any) => {
        setBankDetails(prev => ({
            ...prev,
            swiftCode: account.swiftBic || "",
            beneficiaryBank: account.bankName || "",
            // branch: account.branchCode || "",
            bankAddress: account.bankAddress || "",
            city: account.beneficiaryAddresses?.[0]?.address || "",
            state: account.beneficiaryAddresses?.[1]?.address || "",
            country: account.beneficiaryAddresses?.[2]?.address || "",
            beneficiaryName: account.name || "",
            beneficiaryAccountNumber: account.accountNo || "",
            receivingPartyCountryCode: account.countryCode || "",
        }));
    };

    const validateFields = () => {
        const newErrors: { [key: string]: string } = {};

        // Check for empty fields
        Object.entries(bankDetails).forEach(([key, value]) => {
            if (!value.trim()) {
                newErrors[key] = "This field is required.";
            }
        });

        // Validate Beneficiary Account Number
        if (
            bankDetails.beneficiaryAccountNumber &&
            !/^\d{9,35}$/.test(bankDetails.beneficiaryAccountNumber)
        ) {
            newErrors.beneficiaryAccountNumber = "Account Number must be 9-35 digits.";
        }

        const addressRegex = /^[a-zA-Z0-9\s,.-]+$/;

        (["bankAddress", "city", "state", "country"] as Array<keyof typeof bankDetails>).forEach((field) => {
            if (bankDetails[field] && !addressRegex.test(bankDetails[field])) {
                newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} contains invalid characters.`;
            }
        });

        const nameRegex = /^[A-Za-z\s]+$/;
        (["senderName", "beneficiaryName", "beneficiaryBank", "bankAddress", "city", "state"] as Array<keyof typeof bankDetails>).forEach((field) => {
            const val = bankDetails[field];
            if (val) {
                if (!nameRegex.test(val)) {
                    newErrors[field] = `${field
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, str => str.toUpperCase())} can only contain letters and spaces.`;
                }
            }
        });

        setErrors(newErrors);

        // Return whether the form is valid
        return Object.keys(newErrors).length === 0;
    };

    const handleFetchBankDetails = () => {
        setModalOpen(true);
        setAccountType("self");
    };

    const handleFetchBeneficiaryDetails = () => {
        setModalOpen(true);
        setAccountType("beneficiary");
    };

    const handleSave = async () => {
        if (!validateFields()) {
            return; // Stop if validation fails
        }

        await dispat(
            createAccount({
                userId: `${userID}`,
                name: bankDetails.beneficiaryName,
                accountNo: bankDetails.beneficiaryAccountNumber,
                swiftBic: bankDetails.swiftCode,
                IFSC: "",
                UPI_ID: "",
                bankName: bankDetails.beneficiaryBank,
                bankAddress: bankDetails.bankAddress,
                beneficiaryAddresses: [
                    { address: bankDetails.city },
                    { address: bankDetails.state },
                    { address: bankDetails.country },
                ],
                branchCode: "",
                countryCode: bankDetails.receivingPartyCountryCode,
                selfAccount: 0,
            })
        );

        dispatch(saveBankDetails(bankDetails));
        handleCloseModal();
    };

    return (
        <Modal open={openModal} onClose={handleCloseModal}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: isSmallScreen ? "90%" : "50%",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    Add Bank Account
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Receiver SWIFT BIC"
                            value={bankDetails.swiftCode}
                            onChange={(e) =>
                                setBankDetails((prev) => ({
                                    ...prev,
                                    swiftCode: e.target.value,
                                }))
                            }
                            // disabled
                            error={!!errors.swiftCode}
                            helperText={errors.swiftCode}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleFetchBankDetails}
                        >
                            Fetch Self Account Details
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleFetchBeneficiaryDetails}
                        >
                            Fetch Beneficiary Account Details
                        </Button>
                    </Grid>
                    {Object.entries(bankDetails).map(([key, value]) => (
                        key !== "swiftCode" && key != "country" &&
                        (
                            key.includes('CountryCode') ?
                                <Grid item xs={wideFields.includes(key) ? 12 : 6} key={key}>
                                    <CountryCodeDropdown
                                        value={key == 'receivingPartyCountryCode' ? bankDetails.receivingPartyCountryCode : bankDetails.senderPartyCountryCode}
                                        // onSearch={name => dispat(countryCodeList(name))}
                                        onSelect={opt => {
                                            if (key === 'receivingPartyCountryCode') {
                                                // beneficiary dropdown
                                                if (opt) {
                                                    setBankDetails(prev => ({
                                                        ...prev,
                                                        receivingPartyCountryCode: opt.code,
                                                        country: opt.name
                                                    }));
                                                }
                                            } else {
                                                // sender dropdown
                                                if (opt) {
                                                    setBankDetails(prev => ({
                                                        ...prev,
                                                        senderPartyCountryCode: opt.code,
                                                    }));
                                                }
                                            }
                                        }
                                        }
                                        options={codes}
                                        error={!!errors[key]}
                                        helperText={errors[key]}
                                        title={key == 'receivingPartyCountryCode' ? 'Country Code - Beneficiary' : 'Country Code - Sender'}
                                    />
                                </Grid>
                                :
                                (key === 'correspondentBankCharges') ?

                                    <Grid item xs={12} key={key}>
                                        <FormControl fullWidth error={!!errors[key]}>
                                            <InputLabel id={`${key}-label`}>
                                                Correspondent Bank Charges
                                            </InputLabel>
                                            <Select
                                                labelId={`${key}-label`}
                                                id={key}
                                                value={value}
                                                label="Correspondent Bank Charges"
                                                onChange={e =>
                                                    setBankDetails(prev => ({
                                                        ...prev,
                                                        [key]: e.target.value as string
                                                    }))
                                                }
                                            >
                                                <MenuItem value="CRED">Paid by beneficiary</MenuItem>
                                                <MenuItem value="DEBT">Paid by Sender</MenuItem>
                                                <MenuItem value="SHA">Shared by both parties</MenuItem>
                                            </Select>
                                            {errors[key] && (
                                                <FormHelperText>{errors[key]}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    :
                                    <Grid item xs={wideFields.includes(key) ? 12 : 6} key={key}>
                                        <TextField
                                            fullWidth
                                            label={key
                                                .replace(/([A-Z])/g, " $1")
                                                .replace(/^./, (str) => str.toUpperCase())}
                                            value={value}
                                            onChange={(e) =>
                                                setBankDetails((prev) => ({
                                                    ...prev,
                                                    [key]: e.target.value,
                                                }))
                                            }
                                            error={!!errors[key]}
                                            helperText={errors[key]}
                                        />
                                    </Grid>
                        )
                    ))}
                </Grid>
                <Box mt={3} textAlign="center">
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={handleSave}
                    >
                        Save Bank Account
                    </Button>
                </Box>
                <AccountSelectorModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSelectSender={mapAccountToSelf}
                    onSelect={mapAccountToBankDetails}
                    accountType={accountType}
                />
            </Box>
        </Modal>
    );
};

export default BankDetails;
