import { useState, useEffect } from 'react';
import { makeStyles, Typography, Modal, Button } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { addContent, AddContent, auth, deleteContentById, getContentByProjectId, getContentOfAuthor, getMembersOfProject, updateContentById } from '../firebase';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import AddMember from './AddMember';
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));

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
const MyContent = (props) => {
    const classes = useStyles();
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState([]);
    const [formdata, setFormData] = useState([]);
    const [open, setOpen] = useState(false);
    const handleOpen = (data) => {
        console.log(data);
        setFormData(data);
        setOpen(true);
    };
    const handleOpenAdd = () => {
        setFormData({});
        setOpen(true);
    };
    const handleClose = () => setOpen(false);
    let team = props.team;

    const getContent = async () => {
        setLoading(true);
        let user = await auth.currentUser;
        let content = await getContentOfAuthor(team.docId, user.uid);
        setContent(content);
        console.log(content);
        setLoading(false);
    }

    const updateContent = async (data, id) => {
        setLoading(true)
        let user = await auth.currentUser;
        console.log("IDDD", id);
        if (id) {
            updateContentById(data, team.docId, id).then(async () => {
                let content = await getContentOfAuthor(team.docId, user.uid);
                setContent(content)
            })
        } else {
            addContent(data, team.docId, user.uid).then(async () => {
                let content = await getContentOfAuthor(team.docId, user.uid);
                setContent(content)
            })
        }
        setLoading(false)
        handleClose()
    }

    const deleteContent = async (data) => {
        console.log(data);
        setLoading(true)
        deleteContentById(team.docId, data.docId).then(async () => {
            let user = await auth.currentUser;
            let content = await getContentOfAuthor(team.docId, user.uid);
            setContent(content)
        })
        setLoading(false)
    }

    useEffect(() => {
        getContent();
    }, []);

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <><h1>AllContent<Button variant="contained" style={{ marginLeft: 30 }} onClick={() => handleOpenAdd()}>ADD</Button></h1>
            {content && content.map((demo) => <>
                <div style={{ border: '1px solid black', padding: 30, borderRadius: 20, marginTop: 20 }}>
                    <Typography><b>{demo.heading}</b></Typography>
                    <Typography>{demo.body}</Typography><br />
                    <Button variant="contained" onClick={() => handleOpen(demo)}>Update</Button>
                    <Button style={{ marginLeft: 30 }} onClick={() => deleteContent(demo)}> <Delete /> </Button>

                    {formdata && <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <form onSubmit={handleSubmit((data) => {
                                console.log(data);
                                updateContent(data, formdata.docId);
                            })}>
                                <label htmlFor="heading"> heading : </label>
                                <input {...register("heading")} id="heading" defaultValue={formdata.heading} /> <br /> <br />
                                <label htmlFor="body"> body : </label>
                                <textarea {...register("body")} id="body" defaultValue={formdata.body} ></textarea>
                                <br /><br />
                                <input type="submit" value="SUBMIT" />
                            </form>
                        </Box>
                    </Modal>}
                </div>
            </>)}
        </>
    );
}

export default MyContent;