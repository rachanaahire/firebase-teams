import { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, makeStyles, Button, Card, CardActions, CardContent, CardMedia, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));

const About = (props) => {
    const classes = useStyles();
    let team = props.team;

    return (
        <>
        <h1>Team: {team.name}</h1>
        <Typography>Description : {team.description}</Typography>
        <Typography>Created On : {new Date(team.createdOn.seconds * 1000).toLocaleDateString("en-GB")}</Typography>
        </>
    );
}

export default About;