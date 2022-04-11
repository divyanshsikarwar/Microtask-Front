import React, { useState } from "react";
import {
  Grid,
  makeStyles,
  Card,
  CardContent,
  MenuItem,
  InputLabel,
  Select,
  CardActions,
  Button,
  CardHeader,
  FormControl,
  Typography,
} from "@material-ui/core";
import axios from "axios";

import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import SendIcon from "@material-ui/icons/Send";
import Icon from "@material-ui/core/Icon";
import SaveIcon from "@material-ui/icons/Save";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyle = makeStyles((theme) => ({
  padding: {
    padding: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
  },
}));
let quote = "";
let url = "";
let file = false;
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const UserForm = () => {
  const classes = useStyle();

  const [disability, updateDisability] = useState(true);
  const [alertOpen, updatealertOpen] = useState(false);
  const [alertMessage, updatealertMessage] = useState("");
  const [alertSeverity, updatealertSeverity] = useState("Success");
  function checkConsecutive() {
    let i = 0;
    let j = 0;
    let cc = 0;
    while (j < quote.length) {
      if (quote[i] == quote[j]) {
        j++;
        cc++;
        if (cc == 4) {
          return true;
        }
      } else {
        cc = 0;
        i = j;
      }
    }
    return false;
  }

  function frequency() {
    let x = quote.trim().split(" ");
    let obj = {};
    for (let i = 0; i < x.length; i++) {
      if (obj[x[i]]) {
        obj[x[i]] += 1;
      } else {
        obj[x[i]] = 1;
      }
    }
    let total = 0;
    for (let i in obj) {
      total += obj[i];
    }
    for (let i in obj) {
      if (obj[i] / total > 0.7) {
        return false;
      }
    }
    return true;
  }

  function checkQuoteValidity() {
    if (
      quote.length < 6 ||
      quote.trim().split(" ").length < 4 ||
      checkConsecutive() ||
      frequency() == false
    ) {
      return false;
    } else {
      return true;
    }
  }

  async function checkUrlValidity() {
    if (url.length === 0) {
      return false;
    } else {
      let response = await axios.post("https://microtask-4gsoc.herokuapp.com/isUrlValid?", {
        url: url,
      });
      console.log(response.data.bool);
      return response.data.bool;
    }
  }

  async function checkDisability() {
    if (checkQuoteValidity()) {
      updateDisability(false);
    } else {
      updateDisability(true);
    }
  }

  async function handleSendRequest() {
    updatealertMessage("Confirming Url Validity");
    updatealertSeverity("info");
    updatealertOpen(true);
    let response = await checkUrlValidity();
    if (response) {
      updatealertOpen(false);
      updatealertMessage(
        "Request Successfully Sent, Thankyou for improving Wikipedia."
      );
      updatealertSeverity("success");
      updatealertOpen(true);
    } else {
      updatealertOpen(false);
      updatealertMessage("Invalid Url");
      updatealertSeverity("error");
      updatealertOpen(true);
    }
  }

  function handleAlertClose() {
    updatealertOpen(false);
  }

  return (
    <>
      <Grid
        container
        justify="center"
        spacing={1}
        style={{ marginTop: "50px" }}
      >
        <Grid item md={5}>
          <Card className={classes.padding}>
            <CardHeader title="Edit Request Form"></CardHeader>
            <Grid item container spacing={1}>
              <Grid item xs={12} sm={6} md={12}>
                <TextField
                  id="standard-multiline-static"
                  multiline
                  rows={4}
                  label="Quote"
                  variant="outlined"
                  fullWidth
                  name="Quote"
                  required
                  onChange={function (e) {
                    quote = e.target.value;
                    checkDisability();
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={12}>
                <TextField
                  id="standard-basic"
                  label="URL"
                  fullWidth
                  onChange={function (e) {
                    url = e.target.value;
                    checkDisability();
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={12}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Typography>OR</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={12}>
                <label>
                  <input
                    style={{ display: "none" }}
                    id="upload-photo"
                    name="upload-photo"
                    type="file"
                    fullWidth
                    onChange={function (e) {
                      file = true;
                      checkDisability();
                    }}
                  />

                  <Button
                    variant="contained"
                    color="default"
                    className={classes.button}
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    component="span"
                  >
                    File Upload
                  </Button>
                </label>
              </Grid>

              <Button
                color="secondary"
                variant="contained"
                component="span"
                style={{ backgroundColor: "#3464cc", marginLeft: "11px" }}
                endIcon={<SendIcon />}
                onClick={handleSendRequest}
                disabled={disability}
              >
                Send Request
              </Button>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={alertOpen}
        autoHideDuration={5000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserForm;
