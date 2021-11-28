import { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, makeStyles, Button, Card, CardActions, CardContent, CardMedia, Grid } from '@material-ui/core';
import {  } from '../firebase';
import About from './About';
import AllContent from './AllContent';
import MyContent from './MyContent';
import Members from './Members';
import ProjectSettings from './ProjectSettings';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));

const Project = (props) => {
    const classes = useStyles();
    const [navId, setNavId] = useState(0);
    console.log(props.team);

    const navigate = (id) => {
        setNavId(id);
    }

    return (
        <>
            <Button onClick={() => navigate(0)} size="small" variant="outlined"> ABOUT </Button>
            <Button onClick={() => navigate(1)} size="small" variant="outlined"> ALL Contents </Button>
            <Button onClick={() => navigate(3)} size="small" variant="outlined"> Members </Button>
            <Button onClick={() => navigate(2)} size="small" variant="outlined"> My Contents </Button>
            <Button onClick={() => navigate(4)} size="small" variant="outlined"> Settings </Button>
            {navId === 0 && <About team={props.team} />}
            {navId === 1 && <AllContent />}
            {navId == 2 && <MyContent />}
            {navId == 3 && <Members />}
            {navId == 4 && <ProjectSettings />}
        </>
    );
}

export default Project;