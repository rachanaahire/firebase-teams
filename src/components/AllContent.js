import { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, makeStyles, Button, Card, CardActions, CardContent, CardMedia, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));

const AllContent = (props) => {
    const classes = useStyles();
    let team = props.team;

    return (
        <> <h1>ALL CONTENT</h1>
        </>
    );
}

export default AllContent;