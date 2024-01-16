const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' directory

const API_KEY = "Y233f6703823106c385cc4b2905a19563"; // Replace with your actual Fixer.io API key

// Define the /currencies route
app.get("/currencies", async (req, res) => {
  try {
    const response = await axios.get("https://open.er-api.com/v6/latest", {
      headers: {
        apikey: API_KEY,
      },
    });

    const currencies = Object.keys(response.data.rates);
    res.json(currencies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define the /convert route
app.get("/convert", async (req, res) => {
  const { amount, from, to } = req.query;

  try {
    const response = await axios.get("https://open.er-api.com/v6/latest", {
      headers: {
        apikey: API_KEY,
      },
    });

    const rates = response.data.rates;
    const convertedAmount = (amount * rates[to]) / rates[from];

    res.json({
      amount: parseFloat(amount),
      from,
      to,
      convertedAmount: parseFloat(convertedAmount.toFixed(2)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
