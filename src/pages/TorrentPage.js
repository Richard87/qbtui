import React, { useContext, useState, useEffect } from "react"
import { ApiContext } from "./App"
import { makeStyles } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import { IconButton, Drawer } from "@material-ui/core"
import Container from "@material-ui/core/Container"
import CssBaseline from "@material-ui/core/CssBaseline"
import MUIDataTable from "mui-datatables"
import TablePagination from "@material-ui/core/TablePagination"
import useCategories from "./useCategories"

import Box from "@material-ui/core/Box"

import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Tooltip from "@material-ui/core/Tooltip"
import CompareArrowsIcon from "@material-ui/icons/CompareArrows"
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox"
import BlockIcon from "@material-ui/icons/Block"
import DeleteIcon from "@material-ui/icons/Delete"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import PauseIcon from "@material-ui/icons/Pause"
import AddIcon from "@material-ui/icons/Add"

import { DropzoneDialog } from "material-ui-dropzone"
import Button from "@material-ui/core/Button"

const useStyles = makeStyles((theme) => {
    return {
        table: {
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4),
        },
    }
})

const fetchTorrents = (api, enqueueSnackbar) => {
    return api.torrents().catch((err) => enqueueSnackbar(err.message, { variant: "error" }))
}

const sendFile = (uri, { torrents, ...options }) => {
    const body = new FormData()

    for (let i = 0; i < options.torrents.length; i++) {
        body.append("torrents", options.torrents[i])
    }

    for (let [key, value] of Object.entries(options)) {
        body.append(key, value)
    }

    return fetch(uri, { method: "POST", body })
}

const TorrentPage = () => {
    const api = useContext(ApiContext)
    const [torrents, setTorrents] = useState([])
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [showTorrentDetails, setShowTorrentDetails] = useState(null)

    const onInfo = (hash) => {
        torrent = torrents.find((t) => t.hash === hash)
        console.log(torrent)
        setShowTorrentDetails(torrent)
    }

    const categories = useCategories(torrents, api, selections, onInfo)
    useEffect(() => {
        fetchTorrents(api, enqueueSnackbar).then(setTorrents)

        const interval = setInterval(() => {
            fetchTorrents(api, enqueueSnackbar).then(setTorrents)
        }, 5000)

        return () => {
            clearInterval(interval)
        }
    }, [api, enqueueSnackbar])

    const onSaveTorrent = (torrents, e) => {
        setShowUploadDialog(false)

        sendFile("/api/v2/torrents/add", {
            // urls: "", //        string 	URLs separated with newlines
            torrents: torrents, //        raw 	Raw data of torrent file. torrents can be presented multiple times.
            savepath: "/downloads3/Film", //        optional 	string 	Download folder
            category: "", //        optional 	string 	Category for the torrent
            skip_checking: "", //        optional 	string 	Skip hash checking. Possible values are true, false (default)
            paused: "", //        optional 	string 	Add torrents in the paused state. Possible values are true, false (default)
            root_folder: "true", //        optional 	string 	Create the root folder. Possible values are true, false, unset (default)
            upLimit: "", //        optional 	integer 	Set torrent upload speed limit. Unit in bytes/second
            dlLimit: "", //        optional 	integer 	Set torrent download speed limit. Unit in bytes/second
            sequentialDownload: false, //        optional 	string 	Enable sequential download. Possible values are true, false (default)
            firstLastPiecePrio: false, //        optional 	string 	Prioritize download first last piece. Possible values are true, false (default)
        })
            .then((xhr) => enqueueSnackbar("Torrents uploaded", { variant: "success" }))
            .catch((xhr) => enqueueSnackbar("Upload failed", { variant: "error" }))
    }

    return (
        <Container component="main">
            <CssBaseline />
            <MUIDataTable
                size="small"
                data={torrents}
                options={{
                    searchOpen: true,
                    download: false,
                    print: false,
                    responsive: "standard",
                    selectableRows: "none",

                    setTableProps: () => ({ size: "small" }),
                    customFooter: Footer,
                    customToolbar: () => <CustomToolbar showUploadDialog={() => setShowUploadDialog(true)} />,
                }}
                columns={categories}
                className={classes.table}
                size="small"
            />
            <DropzoneDialog
                open={showUploadDialog}
                onSave={onSaveTorrent}
                showPreviews={false}
                maxFileSize={5000000}
                onClose={() => setShowUploadDialog(false)}
            />

            <Drawer anchor={"bottom"} open={!!showTorrentDetails} onClose={() => setShowTorrentDetails(null)}>
                <TorrentDetails torrent={showTorrentDetails} api={api} />
            </Drawer>
        </Container>
    )
}
export default TorrentPage

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    }
}

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    )
}

const TorrentDetails = ({ torrent, api }) => {
    const [properties, setProperties] = useState({})
    const [page, setPage] = useState(0)

    useEffect(() => {
        if (!torrent) return

        api.properties(torrent.hash).then((properties) => setProperties(properties))
    }, [torrent, api])

    console.log({ torrent, properties })

    return (
        <>
            <AppBar position="static">
                <Tabs value={page} onChange={(e, value) => setPage(value)} aria-label="simple tabs example">
                    <Tab label="Item One" {...a11yProps(0)} />
                    <Tab label="Item Two" {...a11yProps(1)} />
                    <Tab label="Item Three" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={page} index={0}>
                Item One
            </TabPanel>
            <TabPanel value={page} index={1}>
                <h1>{torrent?.name.split(".").join(" ") ?? ""}</h1>
                <pre>{JSON.stringify({ torrent, properties }, null, 2)}</pre>
            </TabPanel>
            <TabPanel value={page} index={2}>
                Item Three
            </TabPanel>
        </>
    )
}

const Footer = (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabel) => {
    return (
        <TablePagination
            labelRowsPerPage={""}
            count={count}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
            page={page}
            onChangePage={(dispatch, page) => changePage(page)}
        />
    )
}

const CustomToolbar = ({ showUploadDialog }) => {
    return (
        <>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={showUploadDialog}>
                Upload torrent
            </Button>
        </>
    )
}
