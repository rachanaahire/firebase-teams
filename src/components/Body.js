import { useState, useEffect } from 'react';
import { getAllProjects, getProjectsByUid } from '../firebase';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, makeStyles, Button, Card, CardActions, CardContent, CardMedia, Grid } from '@material-ui/core';
import Project from './Project';

const Body = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [nav, setNav] = useState(false);
    const [user, setUser] = useState('');
    const [teams, setTeams] = useState([]);
    const [myteams, setMyteams] = useState([]);
    const [team, setTeam] = useState({});

    const getProjects = async (uid) => {
        setLoading(true);
        let project_data = await getAllProjects();
        setTeams(project_data);
        let myprojects = await getProjectsByUid(uid);
        setMyteams(myprojects);
        setLoading(false);
    }

    const userState = () => {
        const data = localStorage.getItem('user');
        let us
        if (data !== null) {
            us = JSON.parse(data);
            getProjects(us.userId);
            console.log("dsad",us);
        } else {
            us = null;
        }
        setUser(us);
    }

    const selectProject = (data) => {
        setTeam(data);
        setNav(!nav);
    }

    useEffect(() => {
        userState()
    }, []);

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <div className={classes.root}>
            <div style={{ padding: 60 }}>
                {nav ?
                    <>
                        <Button onClick={() => selectProject(team)} size="small" variant="outlined"> HOME </Button>
                        <Project team={team} />
                    </>
                    :
                    <>
                        <Typography><b>YOUR PROJECTS</b> </Typography> <br />
                        {myteams &&
                            <>
                                <Grid container spacing={3}>
                                    {myteams.map((myteam) => (
                                        <Grid item xs={4} >
                                            <Card sx={{ maxWidth: 345 }}>
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    src={myteam.image} alt="team img"
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        {myteam.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {myteam.description}
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button onClick={() => selectProject(myteam)} size="small">Open</Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        }
                        <br /><br /><Typography><b>ALL PROJECTS</b> </Typography> <br />
                        <Grid container spacing={3}>
                            {teams.map((team) => (
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
                                            <Button onClick={() => selectProject(team)} size="small">Open</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                }<br /><br />
            </div>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));

export default Body;