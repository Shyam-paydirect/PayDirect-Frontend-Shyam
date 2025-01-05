// CurrencyExchanger.tsx (Currency Exchanger Component)
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Input, Divider, CircularProgress, IconButton, Paper, Box, TextField, Tooltip, Avatar, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './currency-exchanger.css';
import '@/../public/assets/css/table.css';
import '@/../public/assets/css/master.css';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useDispatch } from 'react-redux';
import { fetchFxRate, bookFxRate, fetchCcyRate, updateCcyRate } from '@/app/redux/slices/api/fxRateSlice';
import type { AppDispatch } from '@/app/redux/store';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Import the clock icon


interface Currency {
  code: string;
  name: string;
}

const CurrencyExchanger: React.FC = () => {
  const [base, setBase] = useState<string>('USD');
  const [target, setTarget] = useState<string>('INR');
  const [baseValue, setBaseValue] = useState<string>("1");
  const [targetValue, setTargetValue] = useState<string>("0");
  const [uId, setUId] = useState<string>("");
  const [rate, setRate] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [open, setOpen] = useState(false);

  const [timer, setTimer] = useState<number>(0); // Timer state added
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isBaseSelection, setIsBaseSelection] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState("")


  const currencies = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
  ];

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {

  }, [base, target])

  const handleOpen = (isBase: boolean) => {
    setOpen(true);
    setIsBaseSelection(isBase);
    setSearchKeyword("");
  }


  const handleClose = () => {
    setOpen(false);
    setSearchKeyword('');
  };


  const handleCurrencySelect = (code: string) => {
    if (isBaseSelection) {
      setBase(code);
    } else {
      setTarget(code);
    }
    handleClose();
  };

  const getFlagUrl = (code: string): string =>
    `https://wise.com/public-resources/assets/flags/rectangle/${code.toLowerCase()}.png`;
  
  const getTimeDifference = (inputTime: Date) => {
    const now = moment();
    const pastTime = moment(inputTime);
    const duration = moment.duration(now.diff(pastTime));

    const hours = Math.floor(duration.asHours());
    if (hours < 1) {
      return 'Last Updated: < 1h ago';
    } else {
      return `Last Updated: ${hours}h ago`;
    }
  }

  const handleFxRateWhenFailed = async () => {
    try {
      const result = await dispatch(fetchCcyRate()).unwrap();
      setRate(result?.data?.rate);

      const target = (Math.round(result?.data?.rate * parseFloat(baseValue) * 100) / 100).toFixed(2);
      setTargetValue(`${target}`)

      setLastUpdated(getTimeDifference(result?.data?.updateTime))
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "An unknown error occurred";

      setErrorMsg(errorMessage)
    }
  }

  const handleFxRateUpdate = async (rate: number) => {
    try {
      const result = await dispatch(updateCcyRate({rate: rate})).unwrap();
      setRate(result?.data?.rate);

      const target = result?.data?.rate * parseFloat(baseValue);
      setTargetValue(`${target}`)

      setLastUpdated(getTimeDifference(result?.data?.updateTime))
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "An unknown error occurred";

      setErrorMsg(errorMessage)
    }
  }

  const handleGetFxRateClick = async () => {
    setErrorMsg("");
    const bodyData = {
      ccyPair: 'USDINR',
      dealtSide: 'BUY',
      txnAmount: baseValue,
      txnCcy: base,
      tenor: 'TODAY',
      executable: 'Y',
      dealType: 'SPOT/OUTRIGHT',
      clientTxnsId: 'CLIENT-00000001',
    };
    try {

      const response = await dispatch(fetchFxRate(bodyData)).unwrap();

      handleFxRateUpdate(response?.data?.rate)

      setTargetValue(response?.data?.contraAmount);
      setRate(response?.data?.rate);
      setUId(response?.data?.uid);
      setTimer(30); // Reset timer to 30 seconds
    }
    catch (error) {
      handleFxRateWhenFailed()
      setTimer(30); // Reset timer to 30 seconds
      // const errorMessage =
      //   typeof error === "string"
      //     ? error
      //     : error instanceof Error
      //       ? error.message
      //       : "An unknown error occurred";

      // setErrorMsg(errorMessage)
    }
    finally {
      setIsLoading(false); // Reset loading state
    }


  };

  const handleBookFxRate = async () => {
    const bodyData = {
      uid: uId,
      clientTxnsId: "CLIENT-00000001"
    }

    try {
      const response = await dispatch(bookFxRate(bodyData)).unwrap();
      toast.success(response)
    }
    catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "An unknown error occurred";
      toast.dismiss();
      // toast.error(errorMessage)
      setErrorMsg(errorMessage)

    }
  }

  const getColor = (timer: number): string => {
    if (timer > 22.5) {
      const ratio = (30 - timer) / 7.5;
      return `rgb(${Math.round(ratio * 255)}, 255, 0)`; // Green to Yellow
    } else if (timer > 15) {
      const ratio = (22.5 - timer) / 7.5;
      return `rgb(255, ${Math.round(255 - ratio * 90)}, 0)`; // Yellow to Orange
    } else if (timer > 7.5) {
      const ratio = (15 - timer) / 7.5;
      return `rgb(255, ${Math.round(165 - ratio * 165)}, 0)`; // Orange to Red
    } else {
      return `rgb(255, 0, 0)`; // Red
    }
  };

  return (
    <>
      <ToastContainer />
      <Card className="main">
        <CardContent>
          <div className="exchange-rate">
            <Typography variant="h5">Book FX Rate</Typography>
            {/* <span>{exchangeRateText}</span> */}

          </div>
          <div className="  ">
            <div className="control-parent">
              <Typography className="control-label">Sending Amount</Typography>
              <div className="control">

                <Button
                  variant="contained"
                  onClick={() => {
                    handleOpen(true);
                  }}
                  startIcon={<Avatar src={getFlagUrl(base)} />}
                >
                  {base}
                </Button>
                <Input
                  type="number"
                  value={ baseValue.toLocaleString()}
                  onChange={(e) => setBaseValue(e.target.value)}
                  inputProps={{ min: 0, step: 0.01 }}
                />

              </div>
            </div>
            <Typography
              sx={{
                color: 'red',
                fontSize: 12,
                fontWeight: 600,
                textAlign: 'right'
              }}
            >{errorMsg}</Typography>

            <Typography
              sx={{
                color: 'green',
                fontSize: 12,
                fontWeight: 600,
                textAlign: 'right', // Right-align text
                display: 'inline-flex', // Inline flex ensures it works well with text alignment
                alignItems: 'center', // Vertically center the icon and text
                justifyContent: 'flex-end', // Push content to the right
                gap: '4px', // Add spacing between icon and text
                width: '100%', // Ensure it spans the container for alignment
              }}
            >
              {lastUpdated &&
                <AccessTimeIcon
                  sx={{
                    fontSize: 16, // Adjust the size of the icon
                  }}
                />
              }
              {lastUpdated}
            </Typography>


            <div className="control-parent">

              <Typography className="control-label">Receiving Amount</Typography>

              <div className="control">
                <Button
                  variant="contained"
                  onClick={() => {
                    handleOpen(false);
                  }}
                  startIcon={<Avatar src={getFlagUrl(target)} />}
                >
                  {target}
                </Button>
                <Input type="number" value={targetValue} readOnly />
              </div>
              {/* <IconButton className="swap-btn" onClick={swapCurrencies}>
            <SwapVertIcon />
          </IconButton> */}

            </div>
          </div>

          <Divider />

          <section className="rate-details">
            <ul className="rate-details-list">
              <li className="rate-detail">
                <span className="rate">
                  <i className="ri-close-line sign"></i>
                  {isLoading ? <span className='skeleton'>000000</span> : (Math.round(rate * 100) / 100).toFixed(2)}
                  {/* ₹ 84.96 */}
                  <Tooltip
                    title="And here's some amazing content. It's very engaging. Right?"
                    placement="top"
                    arrow
                  >
                    <i
                      className="ri-information-line"
                      style={{ cursor: 'pointer', color: '#17a2b8' }}
                    ></i>
                  </Tooltip>
                </span>
                <span className="rate-reason">@ PayDirect rate per USD</span>
              </li>
              {/* <li className="rate-detail">
              <span className="rate">
                <i className="ri-equal-line sign"></i>
                {loading ? <span className='skeleton'>₹ 000000</span> : <>₹ 836829.24</>}
              </span>
              <span className="rate-reason">FX Amount</span>
            </li>
            <li className="rate-detail">
              <span className="rate">
                <i className="ri-add-line sign"></i>
                {loading ? <span className='skeleton'>₹ 000000</span> : <>₹ 500</>}
              </span>
              <span className="rate-reason">Approx SWIFT Charges</span>
            </li>
            <li className="rate-detail">
              <span className="rate">
                <i className="ri-add-line sign"></i>
                {loading ? <span className='skeleton'>₹ 000000</span> : <>₹ 0.00</>}
              </span>
              <span className="rate-reason">Approx Transaction Charges</span>
            </li>
            <li className="rate-detail">
              <span className="rate">
                <i className="ri-add-line sign"></i>
                {loading ? <span className='skeleton'>₹ 000000</span> : <>₹ 0.00</>}
              </span>
              <span className="rate-reason">Approx Correspondent Bank Charges</span>
            </li>
            <li className="rate-detail">
              <span className="rate">
                <i className="ri-add-line sign"></i>
                {loading ? <span className='skeleton'>₹ 000000</span> : <>₹ 240.64</>}
              </span>
              <span className="rate-reason">GST</span>
            </li> */}
              <li className="rate-detail">
                <span className="rate"><i className="ri-add-line sign"></i>₹ 2000.00</span
                ><span className="rate-reason"
                >Service Charge <span className="gst">(incl. GST)</span></span>
              </li>
            </ul>
            <div className="final-charge-parent">
              <Typography className="final-charge-label totalPayment rate">
                <i className="ri-equal-line sign"></i> ₹ {parseFloat(targetValue) + 2000}
              </Typography>
              <Typography className="final-charge-label">Total Payment</Typography>
            </div>
            <div className="book-parent">
              {/* <Button type="button" className="btn-1 book-button" variant="contained" disabled={timer == 0} onClick={handleBookFxRate}>
                <i className="ri-wallet-line"></i> Book Now
              </Button> */}
              <Box className="timer-button-wrapper" sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', marginTop: (errorMsg ? '4px' : '22px') }}>

                <Box className="timer" sx={{ marginLeft: 'auto', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* Timer Circle */}
                  <CircularProgress
                    variant="determinate"
                    value={(timer / 30) * 100}
                    size={35}
                    thickness={6}
                    sx={{
                      color: getColor(timer), // Color transition from green to red (Edited)
                      transition: 'color 1s linear, stroke-dashoffset 0.1s linear', // Smooth color transition (Edited)
                      strokeLinecap: 'round' // Rounded edges for loader (Edited)
                    }}
                  />
                  {timer != 0 &&
                    <Typography
                      variant="caption"
                      component="div"
                      color="textSecondary"
                      sx={{ position: 'absolute', fontSize: '13px' }}
                    >
                      {timer}
                    </Typography>
                  }
                </Box>
                <Button
                  className="btn-1 book-button"
                  onClick={() => {
                    setIsLoading(true); // Set loading state to true

                    handleGetFxRateClick();
                    setTimeout(() => {

                    }, 300)

                  }
                  }
                  sx={{
                    // marginLeft: 'auto', // Align to the right
                    borderRadius: '8px', // Less rounded corners
                    backgroundColor: '#004080', // Darker blue color
                    color: '#ffffff', // White text color
                    textTransform: 'none', // Prevent uppercase text
                    paddingX: '16px', // Horizontal padding for rectangular look
                    animation: timer === 0 ? 'blink 2s ' : 'none', // Blink animation when timer is 0 (Edited)
                    '&:hover': {
                      backgroundColor: '#00264d', // Even darker blue on hover
                    },
                    '@keyframes blink': {
                      '0%': { opacity: 1 },
                      '50%': { background: '#00264d', opacity: 0.8 },
                      '100%': { opacity: 1 },
                    }
                  }}
                  disabled={isLoading}
                >
                  <AutorenewIcon
                    sx={{
                      fontSize: 16,
                      animation: isLoading
                        ? 'spin 1s linear infinite'
                        : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }} />

                  Get FX Rate
                </Button>
              </Box>
            </div>
          </section>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Select Currency</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            placeholder="Search"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <List>
            {filteredCurrencies.map((currency) => (
              <ListItem
                key={currency.code}
                onClick={() => handleCurrencySelect(currency.code)}
              >
                <Avatar src={getFlagUrl(currency.code)} alt={currency.name} />
                <ListItemText primary={currency.code} secondary={currency.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CurrencyExchanger;
