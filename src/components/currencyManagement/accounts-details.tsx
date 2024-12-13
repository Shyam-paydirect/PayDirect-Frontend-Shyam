// currency-management.tsx (Currency Management Component)
import React from 'react';
import './currency-management.css';
import { Card, CardContent, Typography, Divider } from '@mui/material';

const AccountDetails: React.FC = () => {
  return (
    <div className="background">
      <div className="center">
        <Card className="card">
          <div className="flip">
            <div className="front">
              <div className="strip-bottom"></div>
              <div className="strip-top"></div>

              <svg
                className="logo"
                width="100"
                height="40"
                fill="none"
                viewBox="3.478 7.479 80.523 25.044"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipRule="evenodd" fillRule="evenodd">
                  <path
                    d="m26.205 19.998v-.002c0-1.575.064-2.987 1.232-5.468.338-.722 1.085-1.773-.016-3-.895-.892-1.91-.746-2.595-.351.394-.685.54-1.705-.354-2.6-1.226-1.098-2.281-.352-3-.013-2.482 1.171-3.887 1.236-5.469 1.236-1.586 0-2.994-.065-5.472-1.236-.721-.34-1.781-1.085-3.004.013-.893.895-.743 1.915-.349 2.6-.686-.396-1.704-.541-2.6.35-1.1 1.228-.349 2.28-.017 3.001 1.175 2.48 1.24 3.893 1.24 5.47 0 1.582-.065 2.998-1.24 5.476-.332.717-1.083 1.775.017 3.001.896.89 1.914.742 2.6.352-.394.687-.544 1.704.35 2.59 1.222 1.106 2.282.36 3.003.02 2.48-1.17 3.886-1.233 5.473-1.233 1.58 0 2.986.062 5.469 1.233.719.34 1.774 1.086 3-.02.894-.886.744-1.903.352-2.59.686.39 1.702.543 2.597-.352 1.101-1.226.354-2.284.016-3-1.169-2.483-1.232-3.895-1.232-5.477z"
                    fill="#ff3e3e"
                  />
                  <path
                    d="m23.416 27.44-5.76-4.83s-.78-.762-1.655-.762c-.884 0-1.664.762-1.664.762l-5.759 4.83-.018-.017 4.831-5.76s.76-.777.76-1.663c0-.877-.76-1.655-.76-1.655l-4.831-5.765.018-.02 5.759 4.836s.78.763 1.664.763c.875 0 1.655-.763 1.655-.763l5.76-4.836.024.026-4.84 5.759s-.756.778-.756 1.655c0 .886.755 1.663.755 1.663l4.841 5.759z"
                    fill="#fff"
                  />
                  <path
                    d="m44.204 28.497c1.83-.653 4.095-3.766 3.72-8.667-.363-4.742-2.176-8.468-7.005-8.817 0 0-.915-.066-1.681-.07-.822-.005-.998-.033-1.059.842-.105 1.638-.135 14.39-.03 16.231.012.252.04.858 1.094.964 1.927.186 3.52.037 4.961-.483z"
                    fill="#000"
                  />
                </g>
              </svg>

              <div className="investor">Pay Direct</div>

              <div className="chip">
                <div className="chip-line"></div>
                <div className="chip-line"></div>
                <div className="chip-line"></div>
                <div className="chip-line"></div>
                <div className="chip-main"></div>
              </div>

              <Typography className="card-number" variant="h6">
                5453 2000 0000 0000
              </Typography>

              <Typography className="card-holder" variant="body1">
                Vahdam Global
              </Typography>

              <div className="master">
                <div className="circle master-red"></div>
                <div className="circle master-yellow"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountDetails;
