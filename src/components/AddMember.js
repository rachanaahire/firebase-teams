import { useState, useEffect } from 'react';
import { AppBar, Select, Input, Modal, Toolbar, IconButton, Typography, Menu, MenuItem, makeStyles, Button, Card, CardActions, CardContent, CardMedia, Grid } from '@material-ui/core';

import Box from '@mui/material/Box';
import { useForm, Controller } from 'react-hook-form';
import { getProjectById, updateProjectById, getAllUsersIdandName, getNonMembersUserList, addMembers, getMembersUserList, delMembers } from '../firebase';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    }
}));

const AddMember = (props) => {
    const classes = useStyles();
    const { handleSubmit, register, reset, watch, control } = useForm();
    const [loading, setLoading] = useState(false);
    const [mlist, setMList] = useState(false);
    const [nlist, setNList] = useState(false);
    const [project, setProject] = useState({});
    const [nav, setNav] = useState('opt');

    const getNonMemList = async () => {
        let list = await getNonMembersUserList(props.team.docId);
        setNList(list);
    }

    const getMemList = async () => {
        let list = await getMembersUserList(props.team.docId);
        setMList(list);
    }

    const addMem = async (data) => {
        addMembers(props.team.docId, data).then(() => {
            alert("Member added successfully");
            setNav('opt');
        })
    }
    const delMem = async (id) => {
        delMembers(props.team.docId,id).then(() => {
            alert("Member removed successfully");
            setNav('opt');
        })
    }
    let team = props.team;

    const add = () => {
        setNav('add')
    }

    const del = () => {
        setNav('del')
    }

    useEffect(() => {
        getNonMemList()
        getMemList()
    }, []);

    if (loading) {
        return <h1>LOADING</h1>
    }

    return (
        <><br /><br /><br />
            {nav == 'opt' &&
                <>
                    <Button onClick={() => add()} size="small" variant="contained"> ADD MEMBER </Button>
                    <Button onClick={() => del()} size="small" style={{ marginLeft: 30 }} variant="contained"> DELETE MEMBER </Button>
                </>
            }
            {nav === 'add' &&
                <>
                    <form onSubmit={handleSubmit((data) => {
                        console.log(data);
                        addMem(data)

                    })}>
                        <label htmlFor="member"> Select Member :  </label>
                        <Controller
                            render={
                                ({ field }) => <Select {...field}>
                                    {nlist && nlist.map(({ uid, name }) => (
                                        <MenuItem value={uid}>{name}</MenuItem>
                                    ))}
                                </Select>
                            }
                            control={control}
                            name="member"
                        //defaultValue={10}
                        /><br /><br />
                        <label htmlFor="role"> Select Role: </label>
                        <Controller
                            render={
                                ({ field }) => <Select {...field}>
                                    <MenuItem value={'manager'}>Manager</MenuItem>
                                    <MenuItem value={'editor'}>Editor</MenuItem>
                                </Select>
                            }
                            control={control}
                            name="role"
                        //defaultValue={10}
                        /><br /><br />
                        <input type="submit" value="ADD" />
                    </form>
                </>
            }
            {nav === 'del' &&
                <>
                    <form onSubmit={handleSubmit((data) => {
                        console.log(data);
                        delMem(data.member)

                    })}>
                        <label htmlFor="member"> Select Member to Remove :  </label>
                        <Controller
                            render={
                                ({ field }) => <Select {...field}>
                                    {mlist && mlist.map(({ uid, name }) => (
                                        <MenuItem value={uid}>{name}</MenuItem>
                                    ))}
                                </Select>
                            }
                            control={control}
                            name="member"
                        //defaultValue={10}
                        /><br /><br />
                        <input type="submit" value="REMOVE" />
                    </form>
                </>
            }

        </>
    );
}

export default AddMember;