import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import axios from "axios";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function PNRBox({ data, style }) {
  const [expanded, setExpanded] = React.useState(false);
  const [pnrData, setPnrData] = React.useState(data);
  const [load, setLoad] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoad(true);
    setExpanded(false);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://hh4cr4-3000.csb.app/pnr?pnr=" + data.Pnr,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        setPnrData(response.data);
      })
      .catch((e) => {
        alert("Couldn't Refresh at this moment");
        setPnrData(data);
      })
      .then((e) => {
        setLoad(false);
        setExpanded(true);
      });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ ...style, maxWidth: 345, margin: "10px" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor:
                pnrData.PassengerStatus[0].CurrentStatusNew === "CNF"
                  ? "green"
                  : pnrData.PassengerStatus[0].CurrentStatusNew === "RAC"
                    ? "grey"
                    : red[500],
            }}
            aria-label="recipe"
          >
            {pnrData.PassengerStatus[0].CurrentStatusNew}
          </Avatar>
        }
        action={
          <IconButton aria-label="reload" onClick={(e) => handleSubmit(e)}>
            {load ? (
              <CircularProgress color="inherit" size={16} />
            ) : (
              <RefreshIcon />
            )}
          </IconButton>
        }
        title={
          pnrData.BoardingStationName + "  →  " + pnrData.ReservationUptoName
        }
        subheader={
          pnrData.SourceDoj + "  |  " + tConvert(pnrData.DepartureTime)
        }
      />
      <CardContent sx={{ padding: 0, margin: 0 }}>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ textAlign: "center" }}
        >
          <b>{pnrData.TrainNo + "/" + pnrData.TrainName}</b>
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ textAlign: "center" }}
        >
          {"PNR # " + pnrData.Pnr}
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ textAlign: "center" }}
        >
          {"Pass Cnt: " + pnrData.PassengerCount}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: 0, margin: 0 }}>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{ padding: 0, margin: 0, marginLeft: "45%", marginBottom: "5px" }}
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
        sx={{ maxWidth: 300, padding: 0, margin: 0 }}
      >
        <CardContent>
          <Table aria-label="sticky table" sx={{ padding: 0, margin: 0 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <b>Passenger #</b>
                </TableCell>
                <TableCell align="center">
                  <b>Curr. Status</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pnrData.PassengerStatus.map((passenger, idx) => {
                return (
                  <TableRow key={idx}>
                    <TableCell align="center">{"P" + (idx + 1)}</TableCell>
                    <TableCell align="center">
                      {(passenger.CurrentStatus === "CNF"
                        ? passenger.BookingStatus
                        : passenger.CurrentStatus) +
                        (passenger.CurrentStatus === "CNF"
                          ? " (" + passenger.BookingBerthCode + ")"
                          : "")}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell align="left" colSpan={2}>
                  <b>Coach Pos: </b>
                  {pnrData.CoachPosition}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Collapse>
    </Card>
  );
}

function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}
