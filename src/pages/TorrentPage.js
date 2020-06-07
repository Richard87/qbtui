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
    console.log(theme)

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
    const [selections, setSelections] = useState([])
    const categories = useCategories(torrents, api, selections)
    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [showTorrentDetails, setShowTorrentDetails] = useState(null)

    useEffect(() => {
        fetchTorrents(api, enqueueSnackbar).then(setTorrents)

        const interval = setInterval(() => {
            fetchTorrents(api, enqueueSnackbar).then(setTorrents)
        }, 5000)

        return () => {
            clearInterval(interval)
        }
    }, [api, enqueueSnackbar])

    const onSelected = (selectedIndex, allSelectionIndexes) => {
        setSelections(allSelectionIndexes.map((row) => torrents[row.dataIndex].hash))
    }

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

    const rowSelections = selections.reduce((carry, hash) => {
        const index = torrents.findIndex((t) => t.hash === hash)
        if (index !== -1) carry.push(index)

        return carry
    }, [])

    const onRowClick = (rowData, { dataIndex, rowIndex }) => {
        setShowTorrentDetails(torrents[dataIndex])
    }

    return (
        <Container component="main">
            <CssBaseline />
            <MUIDataTable
                size="small"
                data={torrents}
                options={{
                    rowsSelected: rowSelections,
                    selectableRowsOnClick: false,
                    onRowsSelect: onSelected,

                    searchOpen: true,
                    download: false,
                    print: false,
                    responsive: "scrollFullHeight",

                    onRowClick: onRowClick,

                    setTableProps: () => ({ size: "small" }),
                    customFooter: Footer,
                    customToolbar: () => <CustomToolbar showUploadDialog={() => setShowUploadDialog(true)} />,
                    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
                        <CustomToolbarSelect
                            selectedRows={selectedRows}
                            displayData={displayData}
                            api={api}
                            selectedTorrents={selections}
                            torrents={torrents}
                            clearSelection={() => setSelections([])}
                        />
                    ),
                }}
                columns={categories}
                className={classes.table}
                size="small"
            />
            <DropzoneDialog
                open={showUploadDialog}
                onSave={onSaveTorrent}
                acceptedFiles={["application/x-bittorrent"]}
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

const useToolbarSelectStyles = makeStyles((theme) => ({
    iconButton: {},
    iconContainer: {
        marginRight: "24px",
    },
    inverseIcon: {
        transform: "rotate(90deg)",
    },
}))

const CustomToolbarSelect = ({ selectedRows, displayData, selectedTorrents, torrents, api, clearSelection }) => {
    const classes = useToolbarSelectStyles()

    return (
        <div className={classes.iconContainer}>
            <Tooltip title={"Deselect ALL"}>
                <IconButton className={classes.iconButton} onClick={clearSelection}>
                    <IndeterminateCheckBoxIcon className={classes.icon} />
                </IconButton>
            </Tooltip>

            <Tooltip title={"Resume selected"}>
                <IconButton onClick={() => api.resumeTorrents(selectedTorrents.join("|"))}>
                    <PlayArrowIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={"Delete selected"}>
                <IconButton onClick={() => api.deleteTorrents(selectedTorrents.join("|"))}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={"Pause selected"}>
                <IconButton onClick={() => api.pauseTorrents(selectedTorrents.join("|"))}>
                    <PauseIcon />
                </IconButton>
            </Tooltip>
        </div>
    )
}

const TorrentDetails = ({ torrent, api }) => {
    const [properties, setProperties] = useState({})

    useEffect(() => {
        if (!torrent) return

        api.properties(torrent.hash).then((properties) => setProperties(properties))
    }, [torrent, api])

    console.log({ torrent, properties })

    return (
        <>
            <h1>{torrent?.name.split(".").join(" ") ?? ""}</h1>
            <pre>{JSON.stringify({ torrent, properties }, null, 2)}</pre>
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
