import React, {useContext, useState, useEffect} from "react"
import { ApiContext } from "./App"
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useSnackbar } from 'notistack';
import Container from "@material-ui/core/Container"
import CssBaseline from '@material-ui/core/CssBaseline';
import TableHead from '@material-ui/core/TableHead';
import { formatRelative, addSeconds } from "date-fns";

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(1),
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
    table: {
        minWidth: 500,
      },
  }));

const TorrentPage = () => {
    const api = useContext(ApiContext)
    const [torrents, setTorrents] = useState([])
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar()
    console.log(torrents)

    useEffect(() => {
        api.torrents()
            .then(torrents => setTorrents(torrents))
            .catch(e => enqueueSnackbar(e.message, {variant: 'error'}))
    }, [api, enqueueSnackbar])

    return <Container component="main">
        <CssBaseline/>
        
    <TableContainer className={classes.paper} component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Progress</TableCell>
            <TableCell align="right">ETA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {torrents.map((torrent) => (<Row key={torrent.hash} torrent={torrent} />))}
        </TableBody>
      </Table>
    </TableContainer>
    </Container>
}
export default TorrentPage

const Row = ({torrent}) => {
    /* 
    {
  "added_on": 1589138238,
  "amount_left": 0,
  "auto_tmm": false,
  "availability": -1,
  "category": "",
  "completed": 51717631574,
  "completion_on": 1589139264,
  "dl_limit": -1,
  "dlspeed": 0,
  "downloaded": 51745962422,
  "downloaded_session": 0,
  "eta": 8640000,
  "f_l_piece_prio": false,
  "force_start": false,
  "hash": "815df9bf06d58598d2d8f5d3281c602af9ee0098",
  "last_activity": 1589172815,
  "magnet_uri": "magnet:?xt=urn:btih:815df9bf06d58598d2d8f5d3281c602af9ee0098&dn=Avengers.Age.of.Ultron.2015.UHD.BluRay.2160p.TrueHD.Atmos.7.1.HEVC.REMUX-FraMeSToR&tr=https%3a%2f%2ftracker.torrentleech.org%2fa%2f9f22d3d5c95af92012f9d8234ced5121%2fannounce&tr=https%3a%2f%2ftracker.tleechreload.org%2fa%2f9f22d3d5c95af92012f9d8234ced5121%2fannounce",
  "max_ratio": -1,
  "max_seeding_time": -1,
  "name": "Avengers.Age.of.Ultron.2015.UHD.BluRay.2160p.TrueHD.Atmos.7.1.HEVC.REMUX-FraMeSToR",
  "num_complete": 6,
  "num_incomplete": 0,
  "num_leechs": 0,
  "num_seeds": 0,
  "priority": 0,
  "progress": 1,
  "ratio": 0.057179066626888375,
  "ratio_limit": -2,
  "save_path": "/downloads3/Film/",
  "seeding_time_limit": -2,
  "seen_complete": 1590849124,
  "seq_dl": false,
  "size": 51717631574,
  "state": "stalledUP",
  "super_seeding": false,
  "tags": "",
  "time_active": 590234,
  "total_size": 51717631574,
  "tracker": "",
  "up_limit": -1,
  "uploaded": 2958785833,
  "uploaded_session": 0,
  "upspeed": 0
}
*/
    const finishedAt = addSeconds(new Date(), torrent.eta)
    const eta = formatRelative(finishedAt, new Date())


    return <TableRow key={torrent.hash}>
    <TableCell component="th" scope="row">{torrent.name}</TableCell>
    <TableCell align="right">{formatBytes(torrent.size)}</TableCell>
    <TableCell align="right">{torrent.progress * 100}%</TableCell>
    <TableCell align="right">{torrent.progress === 1 ? "Finished" :  eta}</TableCell>
  </TableRow>
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}