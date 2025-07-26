const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/api/swing-signals", (req, res) => {
  res.json([
    {
      ticker: "GFR",
      company: "Greenfire Resources Ltd.",
      score: 83,
      mos: 80,
      fourM: 0,
      sector: "Energy",
      price: "$6.21",
      fairValue: "$31.22"
    },
    {
      ticker: "AEM",
      company: "Agnico Eagle Mines Ltd.",
      score: 83,
      mos: 52,
      fourM: 75,
      sector: "Basic Materials",
      price: "$126.85",
      fairValue: "$264.67"
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});