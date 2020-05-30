import React from "react"
import Container from "@material-ui/core/Container"
import TextField from "@material-ui/core/TextField"
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  
    form: {
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

const LoginPage = ({onLogin}) => {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const classes = useStyles();

    const onSubmit = (e) => {
        e.preventDefault()

        setUsername("")
        setPassword("")

        onLogin(username, password)
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form onSubmit={onSubmit}
                    className={classes.root}
                    noValidate
                    autoComplete="off">
                    <TextField variant="outlined" value={username} onChange={e => setUsername(e.target.value)} margin="normal" id="standard-basic" required fullWidth name="username" label="Username" autoFocus/>
                    <TextField variant="outlined" value={password} onChange={e => setPassword(e.target.value)} margin="normal" id="standard-basic" type="password" required fullWidth label="Passord"/>

                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        Sign In
                    </Button>
                </form>
            </div>
        </Container>
    )
}
export default LoginPage
