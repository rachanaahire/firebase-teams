import { useState, useEffect } from 'react';
import { AppBar, Modal, Toolbar, IconButton, Typography, Menu, MenuItem, makeStyles, Button, Card, CardActions, CardContent, CardMedia, Grid } from '@material-ui/core';

import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import { getProjectById, updateProjectById } from '../firebase';
import AddMember from './AddMember';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));

const ProjectSettings = (props) => {
    const classes = useStyles();
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState({});
    const [nav, setNav] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const updateProject = (data) => {
        setLoading(true)
        updateProjectById(team.docId, data).then(async () => {
            let pdata = await getProjectById(team.docId);
            setProject(pdata);
            setNav(true)
        })
        setOpen(false)
        setLoading(false)
        console.log("DATA", data);
    }
    let team = props.team;

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <> <h1>Settings</h1>
            <div style={{ border: '1px solid black', padding: 30, borderRadius: 20 }}>
                {nav ?
                    <>
                        <Typography><b>Project Name : </b> {project.name}</Typography>
                        <Typography><b>Project Description : </b> {project.description}</Typography> <br />
                    </>
                    :
                    <>
                        <Typography><b>Project Name : </b> {team.name}</Typography>
                        <Typography><b>Project Description : </b> {team.description}</Typography> <br />
                    </>
                }
                <Button variant="contained" onClick={handleOpen}>Update</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <form onSubmit={handleSubmit((data) => {
                            console.log(data);
                            updateProject(data);
                        })}>
                            <label htmlFor="projectName"> Project Name : </label>
                            <input {...register("projectName")} id="projectName" defaultValue={team.name} /> <br /> <br />
                            <label htmlFor="projectDescp"> Project Description : </label>
                            <textarea {...register("projectDescp")} id="projectDescp" defaultValue={team.description} ></textarea>
                            <br /><br />
                            <input type="submit" value="SUBMIT" />
                        </form>
                    </Box>
                </Modal>
            </div>
            <AddMember team={team} />
        </>
    );
}

export default ProjectSettings;