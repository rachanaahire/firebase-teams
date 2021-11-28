import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { getMembersOfProject } from '../firebase';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));

const Members = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState({});
    let team = props.team;

    const getMembers = async () => {
        setLoading(true);
        let members = await getMembersOfProject(team.docId);
        setMembers(members);
        setLoading(false);
    }

    useEffect(() => {
        getMembers();
    }, []);

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <> <h1>Members</h1>
        </>
    );
}

export default Members;