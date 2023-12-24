import * as React from "react";
import Grid from "@mui/material/Grid";

import PNRBox from "./PNRBox";

export default function CachedPNRStack({ data, style }) {
  let sortedData = data.sort(compareDates);
  return (
    <Grid
      container
      spacing={0}
      sx={{ flexDirection: { xs: "column", md: "row" } }}
    >
      {sortedData.map((item, idx) => (
        <PNRBox key={idx} data={item} style={style} />
      ))}
    </Grid>
  );
}

function compareDates(data1, data2) {
  let date1 = convertToDate(data1.SourceDoj);
  let date2 = convertToDate(data2.SourceDoj);
  return date1 < date2
    ? -1
    : date1 > date2
      ? 1
      : data1.DepartureTime <= data2.DepartureTime
        ? -1
        : 1;
}

function convertToDate(date) {
  var dateParts = date.split("-");
  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
}
