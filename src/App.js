import * as React from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TrainIcon from "@mui/icons-material/Train";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import StatusTable from "./StatusTable";
import CachedPNRStack from "./CachedPNRStack";

const glassMorphStyle = {
  backgroundColor: "rgba(255,255,255,0.2)",
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0))",
  backdropFilter: "blur(7px)",
};
const defaultTheme = createTheme();

function GetPNRStatus() {
  const [data, setData] = React.useState(null);
  const [load, setLoad] = React.useState(false);
  const [savedPNR, setSavedPNR] = React.useState([]);
  const [btnDisabled, setBtnDisabled] = React.useState(true);

  React.useEffect(() => {
    if (window.localStorage.PNR) {
      let cachedObjArray = JSON.parse(window.localStorage.getItem("PNR"));
      setSavedPNR(cachedObjArray);
    }
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("submit").click();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoad(true);
    const formData = new FormData(event.currentTarget);
    const data = formData.get("pnrnum");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://hh4cr4-3000.csb.app/pnr?pnr=" + data,
      headers: {},
    };

    if (data.length === 10) {
      axios
        .request(config)
        .then((response) => {
          setSavedPNR(
            cachedPNR(savedPNR, response.data, formData.get("remember")),
          );
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
          setData(null);
        })
        .then((e) => {
          console.log(e);
          setLoad(false);
        });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          backgroundImage:
            "url(https://images7.alphacoders.com/661/661783.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "left",
        }}
      >
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} sx={{}}>
          <CachedPNRStack data={savedPNR} style={glassMorphStyle} />
        </Grid>
        <Grid item xs={12} sm={8} md={5} elevation={10} sx={glassMorphStyle}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <TrainIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              PNR Status
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                helperText="PNR should be 10 digit long"
                required
                fullWidth
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={(event) => {
                  if (event.target.value.length === 10) {
                    setBtnDisabled(false);
                  } else {
                    setBtnDisabled(true);
                  }
                }}
                id="pnrnum"
                label="Enter PNR"
                name="pnrnum"
                autoFocus
              />
              <FormControlLabel
                control={
                  <Checkbox name="remember" color="primary" defaultChecked />
                }
                label="Remember this PNR"
              />
              <LoadingButton
                type="submit"
                id="submit"
                fullWidth
                disabled={btnDisabled}
                variant="contained"
                loading={load}
                loadingIndicator={
                  <CircularProgress color="inherit" size={16} />
                }
                loadingPosition="center"
                sx={{ mt: 3, mb: 2 }}
              >
                Check Status
              </LoadingButton>
            </Box>
            {data === null ? (
              ""
            ) : (
              <StatusTable data={data} style={glassMorphStyle} />
            )}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default GetPNRStatus;

function cachedPNR(oldArray, newObj, remember) {
  let newPNR = newObj.Pnr;
  let pnrExist = false;
  for (let obj in oldArray) {
    console.log(oldArray[obj]);
    if (oldArray[obj].Pnr === newPNR) pnrExist = true;
  }
  if (pnrExist || remember == null) {
    return oldArray;
  } else {
    let newArray = [...oldArray, newObj];
    window.localStorage.setItem("PNR", JSON.stringify(newArray));
    return newArray;
  }
}
