import React, { useContext, useState, useEffect } from "react"
import categories from "./categories"
import { ApiContext } from "./App"
import { makeStyles } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import Container from "@material-ui/core/Container"
import CssBaseline from "@material-ui/core/CssBaseline"
import MUIDataTable from "mui-datatables"

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    form: {
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    table: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        width: "100%",
        minWidth: 650,
    },
}))

const TorrentPage = () => {
    const api = useContext(ApiContext)
    const [torrents, setTorrents] = useState([])
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        api.torrents()
            .then((torrents) => {
                console.log(torrents)
                torrents.sort((a, b) => {
                    if (a.progress !== b.progress) return a.progress - b.progress

                    return b.added_on - a.added_on
                })
                setTorrents(torrents)
            })
            .catch((e) => enqueueSnackbar(e.message, { variant: "error" }))
    }, [api, enqueueSnackbar])

    return (
        <Container component="main">
            <CssBaseline />
            <MUIDataTable
                data={torrents}
                options={{ searchOpen: true, download: false, print: false, responsive: true }}
                columns={categories}
                className={classes.table}
                size="small"
            />
        </Container>
    )
}
export default TorrentPage
