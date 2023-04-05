import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, TextField, Typography } from '@material-ui/core';
import { ethers } from 'ethers';
import { abi } from './Boomerang.json';
import './styles/Main.css';
const updateFrequency = 1; // seconds

const formatDuration = (seconds) => {
  const units = [    { label: 'year', duration: 365 * 24 * 60 * 60 },    { label: 'month', duration: 30 * 24 * 60 * 60 },    { label: 'day', duration: 24 * 60 * 60 },    { label: 'hour', duration: 60 * 60 },    { label: 'minute', duration: 60 },    { label: 'second', duration: 1 },  ];

  let duration = seconds;
  const result = [];
  for (const unit of units) {
    const value = Math.floor(duration / unit.duration);
    if (value > 0) {
      result.push(`${value} ${unit.label}${value > 1 ? 's' : ''}`);
      duration -= value * unit.duration;
    }
  }
  return result.join(', ');
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    minHeight: 'calc(100vh - 64px)', // subtract the height of the app bar
  },
  message: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  textField: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: 'primary',
    variant: 'outlined'
  },
  boomerangInfo: {
    marginTop: theme.spacing(4),
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(2),
  },
  label: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  value: {
    marginBottom: theme.spacing(2),
  },
  timeRemaining: {
    fontWeight: 'bold',
    marginTop: theme.spacing(1),
  },
  button: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}));


function Main() {
  const classes = useStyles();
  const { active, account, library } = useWeb3React();
  const [totalBoomerangs, setTotalBoomerangs] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [boomerangInfo, setBoomerangInfo] = useState([]);
  const [boomerangInfoRaw, setBoomerangInfoRaw] = useState([]);
  const [boomerangId, setBoomerangId] = useState('');
  const [fetching, setFetching] = useState(false);

  async function getBoomerangInfo() {
    try {
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      const contract = new ethers.Contract(contractAddress, abi, library);

      const [expiryTime, updateFrequency, lastCheckInTime, creator] = await contract.getBoomerangInfo(boomerangId);
      setBoomerangInfoRaw([expiryTime, updateFrequency, lastCheckInTime, creator]);

      // Convert timestamps to human-readable format
      const formattedExpiryTime = new Date(expiryTime * 1000).toLocaleString();
      const formattedLastCheckInTime = new Date(lastCheckInTime * 1000).toLocaleString();
      const nextCheckInTime = new Date(lastCheckInTime * 1000) + updateFrequency * 1000;
      const timeRemaining = nextCheckInTime - Math.floor(Date.now() / 1000);

      // Store boomerang info as an array of objects
      setBoomerangInfo([
        { label: 'Expiry Time', value: formattedExpiryTime },
        { label: 'Update Frequency', value: formatDuration(updateFrequency) },
        { label: 'Last Check-In Time', value: formattedLastCheckInTime },
        { label: 'Creator', value: creator },
        { label: 'Time Remaining', value: formatDuration(timeRemaining) },
      ]);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    let intervalId;

    async function getTotalBoomerangs() {
      try {
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        const contract = new ethers.Contract(contractAddress, abi, library);

        const result = await contract.getTotalBoomerangs();
        setTotalBoomerangs(result.toString());
      } catch (err) {
        console.error(err);
      }
    }

    function calculateTimeRemaining() {
      try {
        const { lastCheckInTime, updateFrequency } = boomerangInfoRaw;
        const nextCheckInTime = lastCheckInTime + updateFrequency;
        const timeRemaining = nextCheckInTime - Math.floor(Date.now() / 1000);
        setTimeRemaining(formatDuration(timeRemaining));
      } catch (err) {
        console.error(err);
      }
    }

    if (active) {
      getTotalBoomerangs();
      intervalId = setInterval(() => {
        getTotalBoomerangs();
        calculateTimeRemaining();
      }, updateFrequency * 1000);
    }

    return () => clearInterval(intervalId);
  }, [active, library]);

  const handleBoomerangIdChange = (event) => {
    setBoomerangId(event.target.value);
  };

  const handleGoToBoomerang = () => {
    if (boomerangId > 0 && boomerangId <= Number(totalBoomerangs)) {
      getBoomerangInfo();
    }
  };


  return (
    <Container maxWidth="sm" className={classes.container}>
      <Typography variant="h4" align="center" className={classes.message}>
        {`Connected to MetaMask with address ${account}`}
      </Typography>
      <Typography variant="h6" align="center" className={classes.textField}>
        {`Total Boomerangs: ${totalBoomerangs}`}
      </Typography>
      <TextField
        fullWidth
        label="Boomerang ID"
        type="number"
        value={boomerangId}
        onChange={handleBoomerangIdChange}
        InputProps={{ inputProps: { min: 1, max: totalBoomerangs } }}
        className={classes.textField}
        color= 'primary'
        variant='outlined'
        size="small"
        defaultValue="0"
      />
      <Button
        variant="contained"
        color="white"
        onClick={handleGoToBoomerang}
        disabled={!active || fetching}
        className="button"
      >
        Go
      </Button>
      {boomerangInfo.length > 0 && (
        <div>
          <Typography variant="h6" align="center" className={classes.textField}>
            Boomerang Info:
          </Typography>
          {boomerangInfo.map(({ label, value }) => (
            <Typography key={label} variant="body1" align="center" className={classes.textField}>
              {`${label}: ${value}`}
            </Typography>
          ))}
          <Typography variant="body1" align="center">
            {`Time Remaining: ${timeRemaining}`}
            </Typography>
        </div>
      )}
      <Button variant="contained" color="secondary" href="/" className={classes.button}>
        Disconnect Wallet
      </Button>
    </Container>
  );
}

export default Main;
