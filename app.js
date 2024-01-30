// Import necessary modules
const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");

// Create an instance of the express application
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Replace with your actual Fixer.io API key
const API_KEY = "Y233f6703823106c385cc4b2905a19563";

// Define the /currencies route
app.get("/currencies", async (req, res) => {
  try {
    // Fetch the latest currency rates from the Fixer.io API
    const response = await axios.get("https://open.er-api.com/v6/latest", {
      headers: {
        apikey: API_KEY,
      },
    });

    // Extract currency codes from the API response and send them as JSON
    const currencies = Object.keys(response.data.rates);
    res.json(currencies);
  } catch (error) {
    // Log errors and send a 500 Internal Server Error response
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define the /convert route
app.get("/convert", async (req, res) => {
  const { amount, from, to } = req.query;

  try {
    // Fetch the latest currency rates from the Fixer.io API
    const response = await axios.get("https://open.er-api.com/v6/latest", {
      headers: {
        apikey: API_KEY,
      },
    });

    // Calculate the converted amount based on the provided parameters
    const rates = response.data.rates;
    const convertedAmount = (amount * rates[to]) / rates[from];

    // Send the conversion result as JSON
    res.json({
      amount: parseFloat(amount),
      from,
      to,
      convertedAmount: parseFloat(convertedAmount.toFixed(2)),
    });
  } catch (error) {
    // Log errors and send a 500 Internal Server Error response
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Serve the HTML file when accessing the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
