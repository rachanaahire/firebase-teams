import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { getContentByProjectId, getMembersOfProject } from '../firebase';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));

const MyContent = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState([]);
    let team = props.team;

    const getContent = async () => {
        setLoading(true);
        let content = await getContentByProjectId(team.docId);
        setContent(content);
        console.log(content);
        setLoading(false);
    }

    useEffect(() => {
        getContent();
    }, []);

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <> <h1>MyContent</h1>
        </>
    );
}

export default MyContent;