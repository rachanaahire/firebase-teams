import { useState, useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { getAllContent, getContentByProjectId, getMembersOfProject } from '../firebase';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));

const AllContent = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState([]);
    let team = props.team;

    const getContent = async () => {
        setLoading(true);
        let content = await getContentByProjectId(team.docId);
        setContent(content);
        setLoading(false);
    }

    useEffect(() => {
        getContent();
    }, []);

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <> <h1>AllContent</h1>
            {content ? content.map((demo) => <>
                <div style={{ border: '1px solid black', padding: 30, borderRadius: 20, marginTop: 20 }}>
                    <Typography><b>{demo.heading}</b></Typography>
                    <Typography>{demo.body}</Typography>
                </div>
            </>)
            :
            <>
            <Typography>No Contents Added yet</Typography>
            </>}
        </>
    );
}

export default AllContent;