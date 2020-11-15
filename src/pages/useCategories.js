import React, { useContext } from "react"
import { formatRelative, format, formatDistance } from "date-fns"
import { IconButton, TableCell, Tooltip, makeStyles } from "@material-ui/core"
import { ApiContext } from "./App"
import DeleteIcon from "@material-ui/icons/Delete"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import PauseIcon from "@material-ui/icons/Pause"
import InfoIcon from "@material-ui/icons/Info"

const now = new Date()

const useCategories = (torrents, api, selections, onInfo) => {
    return [
        {
            name: "name",
            label: "Name",
            options: {
                filter: false,
                sort: true,
                display: "true",
                viewColumns: true,
                searchable: true,
                customBodyRender: (value) => <NameCell value={value} />,
            },
        },
        {
            name: "added_on",
            label: "Added on",
            options: {},
            options: {
                filter: false,
                sort: true,
                display: "true",
                viewColumns: true,
                searchable: false,
                customBodyRender: formatDate,
            },
        },
        {
            name: "amount_left",
            label: "Amount left",
            options: {
                filter: false,
                sort: true,
                display: "false",
                viewColumns: true,
                searchable: false,
                customBodyRender: formatBytes,
            },
        },
        {
            name: "auto_tmm",
            label: "Auto tmm",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "availability",
            label: "Availabability",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "category",
            label: "Category",
            options: { filter: true, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "completed",
            label: "Completed",
            options: {
                filter: false,
                sort: true,
                display: "false",
                viewColumns: true,
                searchable: false,
                customBodyRender: formatBytes,
            },
        },
        {
            name: "completion_on",
            label: "Completion on",
            options: {
                filter: false,
                sort: true,
                display: "false",
                viewColumns: true,
                searchable: false,
                customBodyRender: formatDate,
            },
        },
        {
            name: "dl_limit",
            label: "Download limit",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "dlspeed",
            label: "Download speed",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "downloaded",
            label: "Downloaded",
            options: {
                filter: false,
                sort: true,
                display: "false",
                viewColumns: true,
                searchable: false,
                customBodyRender: formatBytes,
            },
        },
        {
            name: "downloaded_session",
            label: "Download session",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "eta",
            label: "Eta",
            options: {
                filter: false,
                sort: true,
                display: "true",
                viewColumns: true,
                searchable: false,
                customBodyRender: formatTimeDuration,
            },
        },
        {
            name: "f_l_piece_prio",
            label: "FL Piece prio",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "force_start",
            label: "Force start",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "hash",
            label: "Hash",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "last_activity",
            label: "Last activity",
            options: {
                filter: false,
                sort: true,
                display: "false",
                viewColumns: true,
                searchable: false,
                customBodyRender: formatDate,
            },
        },
        {
            name: "magnet_uri",
            label: "Magnet uri",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "max_ratio",
            label: "Max ratio",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "max_seeding_time",
            label: "Max seeding time",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "num_complete",
            label: "Files completed",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "num_incomplete",
            label: "Files incomplete",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "num_leechs",
            label: "Leechers",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "num_seeds",
            label: "Seeders",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "priority",
            label: "Priority",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "progress",
            label: "Progress",
            options: {
                filter: false,
                sort: true,
                display: "true",
                viewColumns: true,
                searchable: false,
                customBodyRender: (value) => (value * 100).toFixed() + "%",
            },
        },
        {
            name: "ratio",
            label: "Ratio",
            options: {
                filter: false,
                sort: true,
                display: "false",
                viewColumns: true,
                searchable: false,
                customBodyRender: (value) => Number(value).toPrecision(2),
            },
        },
        {
            name: "ratio_limit",
            label: "Ratio limit",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "save_path",
            label: "Save path",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "seeding_time_limit",
            label: "Seeding time limit",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "seen_complete",
            label: "Seen complete",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "seq_dl",
            label: "Sequential downloading",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "size",
            label: "Size",
            options: {
                filter: false,
                sort: true,
                display: "false",
                viewColumns: true,
                searchable: false,
                customBodyRender: formatBytes,
            },
        },
        {
            name: "state",
            label: "State",
            options: { filter: true, sort: true, display: "true", viewColumns: true, searchable: false },
        },
        {
            name: "super_seeding",
            label: "Super seeding",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "tags",
            label: "Tags",
            options: { filter: true, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "time_active",
            label: "Time active",
            options: {
                filter: false,
                sort: true,
                display: "true",
                viewColumns: true,
                searchable: false,
                customBodyRender: formatTimeDuration,
            },
        },
        {
            name: "total_size",
            label: "Total size",
            options: {
                filter: false,
                sort: true,
                display: "false",
                viewColumns: true,
                searchable: false,
                customBodyRender: formatBytes,
            },
        },
        {
            name: "tracker",
            label: "Tracker",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "up_limit",
            label: "Upload limit",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "uploaded",
            label: "Uploaded",
            options: {
                filter: false,
                sort: true,
                display: "false",
                viewColumns: true,
                searchable: false,
                customBodyRender: formatBytes,
            },
        },
        {
            name: "uploaded_session",
            label: "Uploaded session",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },
        {
            name: "upspeed",
            label: "Upload speed",
            options: { filter: false, sort: true, display: "false", viewColumns: true, searchable: false },
        },

        {
            name: "",
            label: "",
            options: {
                filter: false,
                sort: false,
                empty: true,
                display: "true",
                viewColumns: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    const hash = torrents[tableMeta.rowIndex].hash

                    return (
                        <>
                            <IconButton onClick={() => api.resumeTorrents(hash)}>
                                <PlayArrowIcon />
                            </IconButton>
                            <IconButton onClick={() => api.deleteTorrents(hash)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton onClick={() => api.pauseTorrents(hash)}>
                                <PauseIcon />
                            </IconButton>
                            <IconButton onClick={() => onInfo(hash)}>
                                <InfoIcon />
                            </IconButton>
                        </>
                    )
                },
            },
        },
    ]
}

const useCellStyle = makeStyles((theme) => ({
    descriptionCell: {
        whiteSpace: "nowrap",
        width: "15em",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
}))

export default useCategories

function formatDate(value, meta, updateValue) {
    return new Date(value * 1000).toLocaleDateString()
}
function NameCell({ value }) {
    const classes = useCellStyle()

    if (!value) return null

    return (
        <Tooltip title={value}>
            <div className={classes.descriptionCell}>{value}</div>
        </Tooltip>
    )
}

function formatTimeDuration(value, meta, updateValue) {
    if (value === 8640000) {
        return "NA"
    }

    return formatDistance(new Date(0), new Date(value * 1000), { includeSeconds: true })
}

function formatBytes(bytes, meta, updateValue) {
    if (bytes === 0) return "0 Bytes"

    const decimals = 2
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}
