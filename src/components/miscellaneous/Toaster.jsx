import { Alert, Button, Snackbar } from "@mui/material";
import React from "react";

const Toaster = React.memo(({ toast, setToast }) => {

    const handleClose = () => {
        setToast((prev) => ({ ...prev, state: false }));
    };
    return (
        <Snackbar 
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={toast.state}
            autoHideDuration={2000}
            onClose={handleClose}
            action={
                <Button color="inherit" onClick={handleClose}>
                    Close
                </Button>
            }
        >
            <Alert onClose={handleClose} severity={toast.severity} sx={{ width: '100%' }}>
                {toast.message}
            </Alert>
        </Snackbar>
    );
});

export default Toaster;
