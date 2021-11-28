import { useState, useEffect } from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { getUserNameByUid } from '../firebase';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));

const About = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [owner, setOwner] = useState('');
    let team = props.team;

    const getOwnerData = async () => {
        setLoading(true);
        let owner_name = await getUserNameByUid(team.owner);
        setOwner(owner_name);
        setLoading(false);
    }

    useEffect(() => {
        getOwnerData();
    }, []);

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <>
            <h1>Team: {team.name}</h1>
            <Typography>Description : {team.description}</Typography>
            <Typography>Owner : {owner}</Typography>
            <Typography>Created On : {new Date(team.createdOn.seconds * 1000).toLocaleDateString("en-GB")}</Typography>
        </>
    );
}

export default About;