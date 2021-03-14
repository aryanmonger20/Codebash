require("dotenv").config();
const express = require("express");
const app = express();

const firebase = require("firebase/app");
const firebaseConfig = require("./firebaseConfig");
// if (!firebase.apps.length) {
// firebase.initializeApp(firebaseConfig);
// firebase.initializeApp({});
// }else {
// }
// firebase.app(); // if already initialized, use that one
require("firebase/firestore");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("static"));

const {
  codechefHandler,
  codeforcesHandler,
  hackerearthHandler,
} = require("./functions/events");

const {
  hackerearthRating,
  codeforcesRating,
  codechefRating,
} = require("./functions/rating");

const {
  webhookPostHandler,
  webhookGetHandler,
} = require("./functions/messenger");
const { sendNotifications } = require("./functions/dailyNotif");

// const { reset } = require("nodemon");
const { config } = require("dotenv");

app.get("/", (req, res) => {
  console.log("GET /");
  res.json({ status: "active" });
});

app.get("/events/codeforces", async (req, res) => {
  res.send(await codeforcesHandler());
});
app.get("/events/hackerearth", async (req, res) => {
  res.send(await hackerearthHandler());
});
app.get("/events/codechef", async (req, res) => {
  res.send(await codechefHandler());
});

app.post("/mg-api/webhook", webhookPostHandler);
app.get("/mg-api/webhook", webhookGetHandler);
app.get("/dailynotification", sendNotifications);
app.post("/dailynotification", sendNotifications);

app.get("/rating/hackerearth/:username", async (req, res) => {
  res.send(await hackerearthRating('hackerearth', req.params.username));
});
app.get("/rating/codeforces/:username", async (req, res) => {
  res.send(await codeforcesRating('codeforces', req.params.username));
});
app.get("/rating/codechef/:username", async (req, res) => {
  res.send(await codechefRating('codechef', req.params.username));
});

// --- LISTEN TO REQUESTS ---
const listener = app.listen(process.env.PORT || 5000, () => {
  console.log(">> Listening on PORT " + listener.address().port);
});

listener;
