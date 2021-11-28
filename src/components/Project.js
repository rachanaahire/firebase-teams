import { useState, useEffect } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { auth, getRoleByProjectId } from '../firebase';
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
    const [loading, setLoading] = useState(false);
    const [navId, setNavId] = useState(0);
    const [role, setRole] = useState('');


    const getRole = async () => {
        setLoading(true);
        let user = await auth.currentUser;
        let role = await getRoleByProjectId(user.uid, props.team.docId);
        setRole(role);
        setLoading(false);
    }

    const navigate = (id) => {
        setNavId(id);
    }

    useEffect(() => {
        getRole()
    }, []);

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <>
            <Button onClick={() => navigate(0)} size="small" variant="outlined"> ABOUT </Button>
            <Button onClick={() => navigate(1)} size="small" variant="outlined"> ALL Contents </Button>
            <Button onClick={() => navigate(2)} size="small" variant="outlined"> Members </Button>
            {role !== 'viewer' && <Button onClick={() => navigate(3)} size="small" variant="outlined"> My Contents </Button>}
            {(role !== 'viewer' && role !== 'editor') && <Button onClick={() => navigate(4)} size="small" variant="outlined"> Settings </Button>}
            {navId === 0 && <About team={props.team} />}
            {navId === 1 && <AllContent team={props.team} />}
            {navId == 2 && <Members team={props.team} />}
            {navId == 3 && <MyContent team={props.team} />}
            {navId == 4 && <ProjectSettings />}
        </>
    );
}

export default Project;