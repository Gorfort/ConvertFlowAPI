const API_KEY = "Y233f6703823106c385cc4b2905a19563"; // Get your API key from Fixer.io

app.get("/currencies", async (req, res) => {
  try {
    const response = await axios.get(`https://open.er-api.com/v6/latest`);
    const currencies = Object.keys(response.data.rates);
    res.json(currencies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
