import React, { useEffect, useState } from 'react';
import {
    Container, CssBaseline, Avatar, Typography,
    Button, Grid, Link, makeStyles, Card, CardContent
} from '@material-ui/core';
import { LockRounded } from '@material-ui/icons';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { auth, createUserDocument } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


const SignUp = (props) => {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEmail = (event) => {
        setEmail(event.target.value);
    }
    const handleName = (event) => {
        setName(event.target.value);
    }
    const handlePassword = (event) => {
        setPassword(event.target.value);
    }
    const handleConfirmPassowerd = (event) => {
        setConfirmPassword(event.target.value);
    }
    const handleSignUp = () => {
        auth.createUserWithEmailAndPassword(email, password)
            .then(data => {
                if (data) {
                    props.toggle();
                    toast.success('User Registered Successfully');
                    createUserDocument(data.user, { name });
                    // console.log(data.user.uid);
                }
            }).catch((error) => {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        toast.error(error.message);
                        break;
                    case 'auth/invalid-email':
                        toast.error(error.message);
                        break;
                    case 'auth/weak-password':
                        toast.error(error.message);
                        break;
                    default:
                        break;
                }
            });
    }

    useEffect(() => {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== password) {
                return false;
            }
            return true;
        });
        return () => {
            ValidatorForm.removeValidationRule('isPasswordMatch');
        }
    }, [password])
    return (
        <Container component="main" maxWidth="xs">
            <Card className={classes.card}>
                <CardContent>
                    <ToastContainer />
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockRounded />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign Up
                        </Typography>
                        <ValidatorForm
                            onSubmit={handleSignUp}
                            className={classes.form}>
                            <TextValidator
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Name"
                                onChange={handleName}
                                name="name"
                                value={name}
                                validators={['required']}
                                errorMessages={['this field is required']}
                                autoComplete='off'
                            />
                            <TextValidator
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                label="Email"
                                onChange={handleEmail}
                                name="email"
                                value={email}
                                validators={['required', 'isEmail']}
                                errorMessages={['this field is required', 'email is not valid']}
                                autoComplete='off'
                            />
                            <br />
                            <TextValidator
                                variant="outlined"
                                fullWidth
                                label="Password"
                                onChange={handlePassword}
                                name="password"
                                type="password"
                                value={password}
                                validators={['required']}
                                errorMessages={['this field is required']}
                                autoComplete="off"
                            />
                            <br />
                            <TextValidator
                                variant="outlined"
                                label="Confirm password"
                                fullWidth
                                onChange={handleConfirmPassowerd}
                                name="confirmPassword"
                                type="password"
                                validators={['isPasswordMatch', 'required']}
                                errorMessages={['password mismatch', 'this field is required']}
                                value={confirmPassword}
                                autoComplete="off"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                className={classes.submit}
                            >
                                Sign Up
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link onClick={props.toggle} className={classes.pointer} variant="body2">
                                        {"Already have an account? Sign In"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    </div>
                </CardContent>
            </Card>
        </Container>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        margin: theme.spacing(3, 0, 2),
        color: '#fff'
    },
    card: {
        marginTop: '60px',
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '20px',
    },
    pointer: {
        cursor: 'pointer',
        color: 'red'
    }
}))
export default SignUp;