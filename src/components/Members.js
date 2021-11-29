import { useState, useEffect } from 'react';
import { makeStyles, Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { getEditorNamesByProjectId, getManagerNamesByProjectId, getMembersOfProject, getUserNameByUid } from '../firebase';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));

const Members = (props) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [owner, setOwner] = useState('');
    const [managers, setManagers] = useState(null);
    const [editors, setEditors] = useState(null);
    const [expanded, setExpanded] = useState(false);
    let team = props.team;

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const getMembers = async () => {
        setLoading(true);
        let ownerName = await getUserNameByUid(team.owner);
        setOwner(ownerName);
        let managerNames = await getManagerNamesByProjectId(team.docId);
        setManagers(managerNames);
        let editorsNames = await getEditorNamesByProjectId(team.docId);
        setEditors(editorsNames);
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
            <div>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography> <b> Owner</b></Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{owner}</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography><b>Managers</b></Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography> {managers && managers.map((name) => <>{name} <br /></>)} </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography><b>Editors</b></Typography>
                    </AccordionSummary>
                    <AccordionDetails> {editors && editors.map((name) => <>{name} <br /></>)}
                    </AccordionDetails>
                </Accordion>
            </div>
        </>
    );


}

export default Members;