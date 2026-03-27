import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios"; // Ensure axios is installed via npm i axios

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// 2. Settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 3. Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("aboutus");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// --- DYNAMIC LIVE TRACKER ROUTE ---
// We use 'async' because fetching data from an API takes time
app.get("/live", async (req, res) => {
  try {
    // 1. Send the request (The same URL you used in Postman)
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd",
    );

    // 2. Extract the numbers from the "Box" (response.data)
    const btc = response.data.bitcoin.usd;
    const eth = response.data.ethereum.usd;
    const usdt = response.data.tether.usd;

    // 3. Render the page and pass the variables to EJS
    res.render("live", {
      btcPrice: btc.toLocaleString(), // Adds commas: 66421 -> 66,421
      ethPrice: eth.toLocaleString(),
      usdtPrice: usdt.toFixed(2), // Rounds to 2 decimals: 0.999 -> 1.00
      date: new Date().toLocaleDateString(),
    });
  } catch (error) {
    // 4. Safety Net: If the API "hangs up" again, show a friendly error
    console.error("Clerk Error: API is acting up.", error.message);
    res.status(500).render("live", {
      btcPrice: "N/A",
      ethPrice: "N/A",
      usdtPrice: "N/A",
      date: "Service Temporarily Offline",
    });
  }
});

// The POST route handles the "Sending" of data
app.post("/login", (req, res) => {
    // We reach into the 'body' pocket of the request
    const email = req.body.username;
    const pass = req.body.password;

    console.log(`Clerk: Received Login for ${email}`);

    // For now, just send them back home
    res.redirect("/");
});

// 4. Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
