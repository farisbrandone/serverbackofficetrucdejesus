const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const dotenv = require("dotenv");
const { format, compareAsc } = require("date-fns");
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const bodyParser = require("body-parser");
const firebaseRoute = require("./src/routes/firebaseRoute");
const {
  sendEveryMinuteNotification,
} = require("./src/controllers/firebaseController");

app.use(bodyParser.json());
app.use(cors());
app.use("/api/firebase", firebaseRoute);
app.get("/", (req, res) => {
  res.json({ mama: "ok" });
});

/* cron.schedule("* * * * *", async () => {
  console.log("Sending every minute");
  await sendEveryMinuteNotification();
}); */

app.listen(PORT, () => {
  console.log(`App listen at http://localhost:${PORT} `);
});
