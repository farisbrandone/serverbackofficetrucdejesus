const express = require("express");
const cors = require("cors");
//const cron = require("node-cron");
const dotenv = require("dotenv");
//const { format, compareAsc } = require("date-fns");
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const bodyParser = require("body-parser");
const firebaseRoute = require("./src/routes/firebaseRoute");
const authenticationRoutes = require("./src/routes/authenticationRoutes");
const frontOfficeRoutes = require("./src/routes/frontOfficeRoutes");
const {
  sendEveryMinuteNotification,
} = require("./src/controllers/firebaseController");
app.use(express.json());
//app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api/firebase", firebaseRoute);
app.use("/api/backoffice", authenticationRoutes);
app.use("/api/frontoffice", frontOfficeRoutes);

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
