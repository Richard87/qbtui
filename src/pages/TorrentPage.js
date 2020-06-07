import React, { useContext, useState, useEffect } from "react"
import { ApiContext } from "./App"
import { makeStyles } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import { IconButton } from "@material-ui/core"
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
    return api
        .torrents()
        .then((torrents) => {
            torrents.sort((a, b) => {
                if (a.progress !== b.progress) return a.progress - b.progress

                return b.added_on - a.added_on
            })

            return torrents
        })
        .catch((err) => enqueueSnackbar(err.message, { variant: "error" }))
}

const TorrentPage = () => {
    const api = useContext(ApiContext)
    const [torrents, setTorrents] = useState([])
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const [selections, setSelections] = useState([])
    const categories = useCategories(torrents, api, selections)

    useEffect(() => {
        fetchTorrents(api, enqueueSnackbar).then((torrents) => setTorrents(torrents))

        const interval = setInterval(() => {
            fetchTorrents(api, enqueueSnackbar).then((torrents) => setTorrents(torrents))
        }, 5000)

        return () => {
            clearInterval(interval)
        }
    }, [api, enqueueSnackbar])

    const onSelected = (selectedIndex, allSelectionIndexes) => {
        setSelections(allSelectionIndexes.map((row) => torrents[row.dataIndex].hash))
    }

    const rowSelections = selections.reduce((carry, hash) => {
        const index = torrents.findIndex((t) => t.hash === hash)
        if (index !== -1) carry.push(index)

        return carry
    }, [])

    return (
        <Container component="main">
            <CssBaseline />
            <MUIDataTable
                data={torrents}
                options={{
                    selectableRowsOnClick: true,
                    onRowsSelect: onSelected,
                    searchOpen: true,
                    download: false,
                    print: false,
                    rowsSelected: rowSelections,
                    responsive: "scrollFullHeight",
                    customFooter: Footer,
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

const Footer = (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabel) => {
    const categories = useCategories()

    const onChangePage = (dispatch, page) => {
        changePage(page)
    }

    return (
        <TablePagination
            labelRowsPerPage={""}
            count={count}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
            page={page}
            onChangePage={onChangePage}
        />
    )
}
