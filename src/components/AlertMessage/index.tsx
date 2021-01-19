import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import './style.css';

type Severity = "error" | "success" | "info" | "warning" | undefined;

interface AlertProps {
  title: string;
  message: string;
  severity: Severity;
}

const AlertMessage: React.FC<AlertProps> = (props) => {

  const [open, setOpen] = useState<boolean>(true);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar 
      open={open}
      autoHideDuration={6000} 
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Alert onClose={handleClose} severity={ props.severity } className="alert-message">
        <AlertTitle> { props.title } </AlertTitle>
        { props.message}
      </Alert>
    </Snackbar>
  )
};

export default AlertMessage;