import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, makeStyles } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { auth } from '../firebase';
import Body from './Body';

const NavBar = (props) => {
    const classes = useStyles();
    const [authen, setAuthen] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        localStorage.removeItem('user');
        props.setUserState();
        setAnchorEl(null);
        auth.signOut().then(() => {
            console.log("Sign-out successful.");
        }).catch((error) => {
            console.log("Sign-out error.");
        });
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.menubackgroud}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Teams Feature
                    </Typography>
                    {authen && (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Body />
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    menubackgroud: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    },
    title: {
        flexGrow: 1
    }
}));

export default NavBar;