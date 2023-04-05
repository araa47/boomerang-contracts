import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: theme.spacing(2),
  },
  message: {
    marginBottom: theme.spacing(2),
  },
  button: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function ConnectWallet({ connector }) {
  const classes = useStyles();
  const { activate, 
          active, 
          //deactivate 
        } = useWeb3React();

  const handleConnectWallet = async () => {
    try {
      await activate(connector);
    } catch (err) {
      console.error(err);
    }
  };

  // const handleDisconnectWallet = () => {
  //   deactivate();
  // };

  if (active) {
    return <Redirect to="/main" />;
  }

  return (
    <div className={classes.container}>
      <Button variant="contained" color="primary" onClick={handleConnectWallet} className={classes.button}>
        Connect
      </Button>
    </div>
  );
}

export default ConnectWallet;
