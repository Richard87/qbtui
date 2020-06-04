import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import LoginPage from "./LoginPage"
import QBApi from "qbittorrent-api-v2"
import TorrentPage from "./TorrentPage"
import { useSnackbar } from "notistack"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}))

export const ApiContext = React.createContext(null)

function App() {
    const [api, setApi] = React.useState(null)
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()

    const onLogin = (username, password) => {
        QBApi.connect(process.env.QBITTORRENT_URL, username, password)
            .then((api) => {
                setApi(api)
            })
            .catch((e) => enqueueSnackbar(e.message, { variant: "error" }))
    }

    return (
        <ApiContext.Provider value={api}>
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            qBitTorrent
                        </Typography>
                    </Toolbar>
                </AppBar>
                {api ? <TorrentPage /> : <LoginPage onLogin={onLogin} />}{" "}
            </div>
        </ApiContext.Provider>
    )
}

export default App
