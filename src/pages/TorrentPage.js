import React, { useContext, useState, useEffect } from "react"
import { ApiContext } from "./App"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import { useSnackbar } from "notistack"
import Container from "@material-ui/core/Container"
import CssBaseline from "@material-ui/core/CssBaseline"
import TableHead from "@material-ui/core/TableHead"
import TablePagination from "@material-ui/core/TablePagination"
import TableFooter from "@material-ui/core/TableFooter"
import { formatRelative, addSeconds } from "date-fns"
import IconButton from "@material-ui/core/IconButton"
import MUIDataTable from "mui-datatables"
import {
    FirstPage as FirstPageIcon,
    LastPage as LastPageIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
} from "@material-ui/icons"

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

    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

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
                columns={["name", "progress", "eta"]}
                className={classes.table}
                size="small"
            />
        </Container>
    )
}
export default TorrentPage

const Row = ({ torrent }) => {
    const finishedAt = addSeconds(new Date(), torrent.eta)
    const eta = formatRelative(finishedAt, new Date())

    return (
        <TableRow key={torrent.hash}>
            <TableCell component="th" scope="row">
                {torrent.name}
            </TableCell>
            <TableCell align="right">{formatBytes(torrent.size)}</TableCell>
            <TableCell align="right">{torrent.progress * 100}%</TableCell>
            <TableCell align="right">{torrent.progress === 1 ? "Finished" : eta}</TableCell>
        </TableRow>
    )
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}))

function TablePaginationActions(props) {
    const classes = useStyles1()
    const theme = useTheme()
    const { count, page, rowsPerPage, onChangePage } = props

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0)
    }

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1)
    }

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1)
    }

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
        <div className={classes.root}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    )
}
