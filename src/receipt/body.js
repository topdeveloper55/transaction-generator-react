import React, { useContext, useRef } from "react";
import { formatEther } from "@ethersproject/units";
import { styled } from "@mui/material/styles";
import { withStyles } from "@mui/styles";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import "../index.css";
import { NET_NAMES } from "../constant";
import Icon from "react-crypto-icons";
import "../index.css";

const CustomPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: "#ffffff",
  backgroundColor: "#14273a",
}));

const NoBorderCell = withStyles({
  root: {
    borderBottom: "none",
  },
})(TableCell);

const Body = React.forwardRef(({ receiptData }, ref) => {
  return (
    <Box p={1} pt={1} mb={2} ref={ref} >
      <CustomPaper elevation={3} sx={{ minHeight: "1050px" }}>
        <div className="background">
          <img
            src="https://www.covalenthq.com/static/images/covalent-logo-tri.svg"
            style={{ marginTop: "10px" }}
          />
        </div>
        <Box display="flex" justifyContent="center">
          <Typography variant="h4">
            Receipt from {NET_NAMES[receiptData.data.net]}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography variant="h7" style={{ color: "#977b7b" }}>
            TxOffset #{receiptData.data.tx_offset} in{" "}
            {NET_NAMES[receiptData.data.net]}
          </Typography>
        </Box>

        <Box p={2} pl={5} mt={3}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <NoBorderCell>Amount Transferred</NoBorderCell>
                <NoBorderCell>Date Transferred</NoBorderCell>
                <NoBorderCell>Symbol</NoBorderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <NoBorderCell>
                  {receiptData.data.log_events.length == 0
                    ? parseFloat(formatEther(receiptData.data.value)).toFixed(
                        3
                      ) + " ETH"
                    : receiptData.data.log_events[0].decoded.params[2].value.slice(
                        0,
                        -1 *
                          receiptData.data.log_events[0]
                            .sender_contract_decimals
                      ) +
                      "." +
                      receiptData.data.log_events[0].decoded.params[2].value.slice(
                        -1 *
                          receiptData.data.log_events[0]
                            .sender_contract_decimals,
                        -1 *
                          receiptData.data.log_events[0]
                            .sender_contract_decimals +
                          3
                      ) +
                      " " +
                      receiptData.data.log_events[0]
                        .sender_contract_ticker_symbol}
                </NoBorderCell>
                <NoBorderCell>
                  {new Date(receiptData.data.date).toLocaleString()}
                </NoBorderCell>
                <NoBorderCell>
                  {receiptData.data.log_events.length == 0 ? (
                    <Icon name="eth" size={25} />
                  ) : (
                    <Icon
                      name={receiptData.data.log_events[0].sender_contract_ticker_symbol.toLowerCase()}
                      size={25}
                    />
                  )}
                </NoBorderCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        <Box p={2} pl={6}>
          <Box mb={1}>
            <Typography variant="h6">Summary</Typography>
          </Box>
          <Box px={5} py={1} display="flex" justifyContent="space-between">
            <Typography>Received Time</Typography>
            <Typography>
              {new Date(receiptData.data.date).toLocaleString()}
            </Typography>
          </Box>
          <Box px={5} py={1} display="flex" justifyContent="space-between">
            <Typography>Transferred Amount</Typography>
            <Typography>
              {receiptData.data.log_events.length == 0
                ? parseFloat(formatEther(receiptData.data.value)).toFixed(3) +
                  " ETH"
                : receiptData.data.log_events[0].decoded.params[2].value.slice(
                    0,
                    -1 * receiptData.data.log_events[0].sender_contract_decimals
                  ) +
                  "." +
                  receiptData.data.log_events[0].decoded.params[2].value.slice(
                    -1 *
                      receiptData.data.log_events[0].sender_contract_decimals,
                    -1 *
                      receiptData.data.log_events[0].sender_contract_decimals +
                      3
                  ) +
                  " " +
                  receiptData.data.log_events[0].sender_contract_ticker_symbol}
            </Typography>
          </Box>
          <Box px={5} py={1} display="flex" justifyContent="space-between">
            <Typography>Symbol</Typography>
            <Typography>
              {receiptData.data.log_events.length == 0 ? (
                <Icon name="eth" size={25} />
              ) : (
                <Icon
                  name={receiptData.data.log_events[0].sender_contract_ticker_symbol.toLowerCase()}
                  size={25}
                />
              )}
            </Typography>
          </Box>

          <Box px={5} py={1} display="flex" justifyContent="space-between">
            <Typography>Transferred Amount(USD)</Typography>
            <Typography>
              {receiptData.data.log_events.length == 0
                ? parseFloat(formatEther(receiptData.data.value)).toFixed(3) +
                  " ETH"
                : receiptData.data.log_events[0].decoded.params[2].value.slice(
                    0,
                    -1 * receiptData.data.log_events[0].sender_contract_decimals
                  ) +
                  "." +
                  receiptData.data.log_events[0].decoded.params[2].value.slice(
                    -1 *
                      receiptData.data.log_events[0].sender_contract_decimals,
                    -1 *
                      receiptData.data.log_events[0].sender_contract_decimals +
                      3
                  ) +
                  " " +
                  receiptData.data.log_events[0].sender_contract_ticker_symbol}
            </Typography>
          </Box>

          <Box px={5} py={1} display="flex" justifyContent="space-between">
            <Typography>Transaction Fee</Typography>
            <Typography>
              {parseFloat(
                formatEther(
                  (
                    receiptData.data.gas_spent * receiptData.data.gas_price
                  ).toString()
                )
              ).toFixed(3)}
              ETH
            </Typography>
          </Box>

          <Box px={5} py={1} display="flex" justifyContent="space-between">
            <Typography>Transaction Fee(USD)</Typography>
            <Typography>${receiptData.data.gas_quote.toFixed(2)}</Typography>
          </Box>
          <Box px={5} py={1} display="flex" justifyContent="space-between">
            <Typography>Sender Address</Typography>
            <Typography>{receiptData.data.from_address}</Typography>
          </Box>
          <Box px={5} py={1} display="flex" justifyContent="space-between">
            <Typography>Receiver Address</Typography>
            <Typography textOverflow="clip" vairant="h6">
              {receiptData.data.log_events.length == 0
                ? receiptData.data.to_address
                : receiptData.data.log_events[0].decoded.params[1].value}
            </Typography>
          </Box>
        </Box>
        <Box px={3} pl={6} textAlign="left" mt={6}>
          <Typography variant="h6" style={{ color: "#977b7b" }}>
            If you have any questions, contact us at{" "}
            <span style={{ color: "#6a6ab3" }}>shop@covalent.com</span> or call
            at &nbsp;
            <span style={{ color: "#6a6ab3" }}>+1 555-123-4567</span>
          </Typography>
        </Box>
        <Box px={3} pl={6} textAlign="left" mt={3}>
          <Typography variant="h7" style={{ color: "#977b7b" }}>
            Something wrong with the email? View it in your browser.
          </Typography>
          <br />
          <Typography variant="h7" style={{ color: "#977b7b" }}>
            You are receiving this email because you made at purchase at
            covalent. Covalent partners with covalent to provide secure
            invoicing and payments processing.
          </Typography>
          <br />
          <br />
          <Typography variant="h7" style={{ color: "#977b7b" }}>
            Covalent 510 Townsend Street, San francisco CA 94103
          </Typography>
          <br />
          <br />
          <Typography variant="h7" style={{ color: "#977b7b" }}>
            Application Name: Covalent API, AID: A00000000031010
          </Typography>
        </Box>
      </CustomPaper>
    </Box>
  );
});

export default Body;
