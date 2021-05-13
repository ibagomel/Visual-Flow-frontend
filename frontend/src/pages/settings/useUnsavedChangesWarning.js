import React, { useState } from 'react';
import { Prompt } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import history from '../../utils/history';

const useUnsavedChangesWarning = () => {
    const { t } = useTranslation();
    const [isDirty, setDirty] = useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [lastLocation, setLastLocation] = useState(false);
    const [confirmedNavigation, setConfirmedNavigation] = useState(false);

    React.useEffect(() => {
        history.push(lastLocation.pathname);
    }, [confirmedNavigation]);

    const showModal = location => {
        if (
            !window.location.pathname.includes(location.pathname) ||
            location.pathname === '/'
        ) {
            setModalVisible(true);
            setLastLocation(location);
        }
    };

    const closeModal = callback => {
        setModalVisible(false);
        if (typeof callback === 'function') {
            callback();
        }
    };

    const handleBlockedNavigation = nextLocation => {
        if (!confirmedNavigation) {
            showModal(nextLocation);
            return false;
        }
        return true;
    };

    const handleConfirmNavigationClick = () =>
        closeModal(() => {
            if (lastLocation) {
                setConfirmedNavigation(true);
            }
        });

    const routerPrompt = (
        <>
            <Prompt when={isDirty} message={handleBlockedNavigation} />
            <Dialog
                open={modalVisible}
                onClose={closeModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('main:confirm.unsaved')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModal} color="primary">
                        No
                    </Button>
                    <Button
                        onClick={handleConfirmNavigationClick}
                        color="primary"
                        autoFocus
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );

    return [routerPrompt, () => setDirty(true), () => setDirty(false)];
};

export default useUnsavedChangesWarning;
