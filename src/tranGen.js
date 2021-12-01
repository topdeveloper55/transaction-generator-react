import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Typography,
  Input,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { formatEther } from "@ethersproject/units";
import { COV_URI, API_KEY, NET_ITEMS } from "./constant";
import DataContext from "./context";
import Icon from "react-crypto-icons";

const FlowCell = withStyles({
  root: {
    overflowWrap: "anywhere",
  },
})(TableCell);
const ColoredItem = withStyles({
  root: {
    color: "black",
  },
})(MenuItem);

export default function TranGen() {
  const history = useHistory();
  const receiptData = useContext(DataContext);
  const [txHash, setTxHash] = useState("");
  const [txData, setTxData] = useState(null);
  const [date, setDate] = useState("");
  const [netId, SetNetId] = useState(1);

  const handleView = () => {
    axios
      .get(`${COV_URI}/${netId}/transaction_v2/${txHash}/?key=${API_KEY}`)
      .then((res) => {
        //console.log("data", res.data.data)
        if (
          res.data.data.items[0].log_events.length > 0 &&
          res.data.data.items[0].log_events[0].sender_contract_ticker_symbol ==
            null
        )
          window.alert("Wrong Coin");
        else {
          setTxData(res.data.data.items[0]);
          setDate(res.data.data.updated_at);
          receiptData.setData({
            ...res.data.data.items[0],
            date: res.data.data.updated_at,
            net: netId,
          });
        }
      })
      .catch((err) => window.alert("Unable to get data"));
  };

  return (
    <Box p={1}>
      <Box mb={4}>
        <Typography variant="h3">
          View information about a specific transaction hash
        </Typography>
      </Box>

      <Box display="flex" mb={2}>
        <Input
          fullWidth
          sx={{ mr: 1, border: 1, borderRadius: 2 }}
          placeholder="enter transaction hash"
          onChange={(ev) => setTxHash(ev.target.value)}
        />
        <Box sx={{ width: 300, mr: 1 }} borderRadius={2} border={1}>
          <Select
            fullWidth
            value={netId}
            defaultValue={1}
            onChange={(ev) => SetNetId(ev.target.value)}
          >
            {NET_ITEMS.map((item) => (
              <ColoredItem key={item.value} value={item.value}>
                {item.name}
              </ColoredItem>
            ))}
          </Select>
        </Box>
        <Button
          size="large"
          variant="contained"
          color="success"
          onClick={handleView}
        >
          View
        </Button>
      </Box>

      <Box mb={4}>
        {txData && (
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 4, md: 8 }}
          >
            <Grid item xs={12} sm={4}>
              <Typography
                color="yellow"
                sx={{ overflowWrap: "anywhere" }}
                vairant="h6"
              >
                {txData.from_address}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              display="flex"
              alignItems="center"
              sx={{ overflowWrap: "anywhere" }}
            >
              <ArrowForwardIcon fontSize="large" />
              <Typography color="yellow" textOverflow="clip" vairant="h6">
                {txData.log_events.length == 0
                  ? txData.to_address
                  : txData.log_events[0].decoded.params[1].value}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              display="flex"
              justifyContent="flex-end"
              sx={{ overflowWrap: "anywhere" }}
              alignItems="center"
            >
              <Typography
                color="yellow"
                textOverflow="clip"
                vairant="h6"
                mr={1}
              >
                {txData.log_events.length == 0
                  ? parseFloat(formatEther(txData.value)).toFixed(3) + " ETH"
                  : txData.log_events[0].decoded.params[2].value.slice(
                      0,
                      -1 * txData.log_events[0].sender_contract_decimals
                    ) +
                    "." +
                    txData.log_events[0].decoded.params[2].value.slice(
                      -1 * txData.log_events[0].sender_contract_decimals,
                      -1 * txData.log_events[0].sender_contract_decimals + 3
                    ) +
                    " " +
                    txData.log_events[0].sender_contract_ticker_symbol}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => history.push("/receipt")}
              >
                View Receipt
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>

      <Box>
        <Box textAlign="center">
          <Typography variant="h4">Summary</Typography>
        </Box>
        {txData && (
          <Grid container columnSpacing={4}>
            <Grid item xs={12} sm={6}>
              <TableContainer
                component={Paper}
                style={{ backgroundColor: "#05182b" }}
              >
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <FlowCell>Property</FlowCell>
                      <FlowCell>Value</FlowCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <FlowCell>Received Time</FlowCell>
                      <FlowCell>{new Date(date).toLocaleString()}</FlowCell>
                    </TableRow>
                    <TableRow>
                      <FlowCell>Symbol</FlowCell>
                      <FlowCell>
                        {txData.log_events.length == 0 ? (
                          <Icon name="eth" size={25} />
                        ) : (
                          <Icon
                            name={txData.log_events[0].sender_contract_ticker_symbol?.toLowerCase()}
                            size={25}
                          />
                        )}
                      </FlowCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TableContainer
                component={Paper}
                style={{ backgroundColor: "#05182b" }}
              >
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <FlowCell>Property</FlowCell>
                      <FlowCell>Value</FlowCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <FlowCell>Transaction Fee</FlowCell>
                      <FlowCell>
                        {parseFloat(
                          formatEther(
                            (txData.gas_spent * txData.gas_price).toString()
                          )
                        ).toFixed(3)}
                        ETH
                      </FlowCell>
                    </TableRow>
                    <TableRow>
                      <FlowCell>Transaction Fee(USD)</FlowCell>
                      <FlowCell>${txData.gas_quote.toFixed(2)}</FlowCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
