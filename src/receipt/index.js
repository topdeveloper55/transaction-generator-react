import React, { useRef, useContext } from "react";
import ReactDOMServer from "react-dom/server";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { ServerStyleSheets } from "@mui/styles";
import Mailgun from "mailgun-js";
import { Container, Box, Grid, Typography, Button, Input } from "@mui/material";
import "../index.css";
import DownloadIcon from "@mui/icons-material/Download";
import ReactToPrint from "react-to-print";
import Body from "./body";
import PdfShift from "pdfshift";
import { PDFS_KEY } from "../constant";
import DataContext from "../context";

const themeDark = createTheme({
  palette: {
    background: {
      default: "#ffffff",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

const pdfShift = new PdfShift(PDFS_KEY);
const sheets = new ServerStyleSheets();
const pdfOptions = {
  margin: "20px",
  sandbox: true,
};

const Receipt = () => {
  const pdfRef = useRef(null);
  const receiptData = useContext(DataContext);
  const generatedHtml = ReactDOMServer.renderToString(
    sheets.collect(
      <ThemeProvider theme={themeDark}>
        <CssBaseline />
        {Object.keys(receiptData.data).length === 0 ? (
          <h2>No Data</h2>
        ) : (
          <Body receiptData={receiptData} ref={null} />
        )}
      </ThemeProvider>
    )
  );
  const cssString = sheets.toString();
  const email = `<!DOCTYPE html>
  <html>
    <head>
      <style>${cssString}</style>
      <style type="text/css"> 
        @media screen and (max-width: 630px) {}
      </style>  
    </head>
    <body style="padding:0; margin:0">${generatedHtml}</body>
  </html>
`;

  return (
    <ThemeProvider theme={themeDark}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Box display="flex">
              <ReactToPrint
                content={() => pdfRef.current}
                trigger={() => (
                  <Button sx={{ alignItems: "center", display: "flex" }}>
                    <Typography color="black">
                      {" "}
                      <DownloadIcon />
                      Download
                    </Typography>
                  </Button>
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box marginTop="10px" display="flex" alignItems="center">
              <Typography color="black" marginRight="10px">
                To:
              </Typography>
              <Input
                placeholder="Enter a receive email"
                sx={{ color: "black", marginRight: "20px" }}
              />
              <Button color="success" size="large" variant="contained">
                Send
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={10} md={8}>
            {Object.keys(receiptData.data).length === 0 ? (
              <h2>No Data</h2>
            ) : (
              <Body receiptData={receiptData} ref={pdfRef} />
            )}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Receipt;
