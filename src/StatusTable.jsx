import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

export default function ColumnGroupingTable({ data, style }) {
  style.width = "100%";
  return (
    <Paper sx={style}>
      <TableContainer sx={{ maxHeight: "45vh" }}>
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ padding: 0 }}>
                <b>{data.Pnr + " (" + data.Class + ")"}</b>
              </TableCell>
              <TableCell align="center" sx={{ padding: 0 }}>
                {data.TrainNo + "/" + data.TrainName}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" sx={{ padding: 0 }}>
                <b>Src: </b>
                {data.BoardingStationName} <b> | </b> {data.SourceDoj}
                <b> | </b> {tConvert(data.DepartureTime)}
                <b> | </b> {"PLF# " + data.ExpectedPlatformNo}
              </TableCell>
              <TableCell align="center" sx={{ padding: 0 }}>
                <b>Dest: </b> {data.ReservationUptoName} <b> | </b>{" "}
                {data.DestinationDoj}
                <b> | </b> {tConvert(data.ArrivalTime)}
              </TableCell>
            </TableRow>
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
            {data.PassengerStatus.map((passenger, idx) => {
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
                {data.CoachPosition}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}
