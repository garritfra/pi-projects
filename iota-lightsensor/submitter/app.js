const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { composeAPI } = require("@iota/core");
const converter = require("@iota/converter");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const provider = "https://testnet140.tangle.works";
const iota = composeAPI({
  provider: provider
});

app.post("/", (req, res) => {
  const address = req.body.address;
  const data = req.body.data;

  // must be truly random & 81-trytes long

  let seed = makeid();

  const trytes = converter.asciiToTrytes(JSON.stringify(req.body.data));

  // Array of transfers which defines transfer recipients and value transferred in IOTAs.
  const transfers = [
    {
      address: req.body.address,
      value: 0, // 1Ki
      tag: "", // optional tag of `0-27` trytes
      message: trytes // optional message in trytes
    }
  ];

  // Depth or how far to go for tip selection entry point
  const depth = 3;

  // Difficulty of Proof-of-Work required to attach transaction to tangle.
  // Minimum value on mainnet & spamnet is `14`, `9` on devnet and other testnets.
  const minWeightMagnitude = 14;

  // Prepare a bundle and signs it
  iota
    .prepareTransfers(seed, transfers)
    .then(trytes => {
      // Persist trytes locally before sending to network.
      // This allows for reattachments and prevents key reuse if trytes can't
      // be recovered by querying the network after broadcasting.

      // Does tip selection, attaches to tangle by doing PoW and broadcasts.
      return iota.sendTrytes(trytes, depth, minWeightMagnitude);
    })
    .then(bundle => {
      res.send(bundle[0].hash);
    })
    .catch(err => {
      // catch any errors
    });
});

app.get("/", (req, res) => {
  iota
    .getNodeInfo()
    .then(info => res.send(info))
    .catch(err => {
      res.send(err);
    });
});

app.get("/new", (req, res) => {
  let seed = makeid();
  let address = iota.getNewAddress(
    seed,
    { index: 0, total: 1, security: 3, checksum: false },
    function(e, address) {
      console.log(address);
      res.send(address);
    }
  );
});

app.listen(1234, err => {
  if (err) console.log(err);
  console.log("Listening on 1234");
});

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9";

  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
