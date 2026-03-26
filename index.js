import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Set up directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Tell Express where your static files (CSS, JS, Images) are
app.use(express.static("public"));

// 2. Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 3. Define your Routes
app.get("/", (req, res) => {
  res.render("index"); // Looks for views/index.ejs
});

app.get("/about", (req, res) => {
  res.render("aboutus"); // Looks for views/aboutus.ejs
});

app.get("/contact", (req, res) => {
  res.render("contact"); // Looks for views/contact.ejs
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
