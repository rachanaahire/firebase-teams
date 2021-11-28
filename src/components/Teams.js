import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, makeStyles, Button, Card, CardActions, CardContent, CardMedia, Grid } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { auth, db } from '../firebase';

const Teams = (props) => {
    const classes = useStyles();
    const uid = props.data.userId;
    const [loading, setLoading] = React.useState(false);
    const [nav, setNav] = React.useState(false);
    const [user, setUser] = React.useState('');
    const [teams, setTeams] = React.useState([]);
    const [team, setTeam] = React.useState({});
    console.log("PROPS===>", props);

    const userState = () => {
        const data = localStorage.getItem('user');
        let us
        if (data !== null) {
            us = JSON.parse(data);
            getAllProjects()
            //getTeamsbyUid();
        } else {
            us = null;
        }
        // const us = data !== null ? JSON.parse(data) : null;
        setUser(us);
    }

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

    const selectTeam = (data) => {
        setTeam(data);
        setNav(true);
    }

    React.useEffect(() => {
        userState()
        // getTeamsbyUid()
        //getAllProjects()
    }, []);


    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <>
            <Grid container spacing={3}>
                {
                    teams.map((team) => (
                        <Grid item xs={4} >
                            <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    src={team.image} alt="team img"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {team.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {team.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={() => selectTeam(team)} size="small">Open</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    // menubackgroud: {
    //     background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    // },
    // title: {
    //     flexGrow: 1
    // }
}));

export default Teams;