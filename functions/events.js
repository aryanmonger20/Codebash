let codeArray = [];

const fetch = require("node-fetch");

const url = `http://contesttrackerapi.herokuapp.com/`;

const fetchData = async (platform) => {
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const dataObjects = data.result.ongoing;
      dataObjects.map((dataObject) => {
        const time = dataObject.EndTime;
        const timeSplit = time.split(" ");
        const date = new Date();
        let day = date.getDate();
        const platformCode = dataObject.Platform;
        if (parseInt(timeSplit[1]) === day) {
          if (platform === platformCode) {
            codeArray.push(dataObject);
          }
        }
      });
      if (codeArray.length === 0)
        codeArray.push({ Error: "No Upcoming Contest Today" });
    })
    .catch((e) => {
      codeArray = [];
    });
};

async function codechefHandler() {
  codeArray = [];
  await fetchData("CODECHEF");
  return codeArray;
}

async function hackerearthHandler(req, res) {
  codeArray = [
    {
      EndTime: "Sun, 14 Mar 2021 18:00",
      Name: "Brute Force 3.0 - Cybersecurity",
      Platform: "HACKEREARTH",
      challenge_type: "contest",
      url: "https://bruteforce3.hackerearth.com/",
    },
    {
      EndTime: "Sun, 14 Mar 2021 18:00",
      Name: "Hackbash",
      Platform: "HACKEREARTH",
      challenge_type: "contest",
      url: "https://hackbash.hackerearth.com/",
    },
  ];
  await fetchData("HACKEREARTH");
  return codeArray;
}

async function codeforcesHandler(req, res) {
  codeArray = [];
  await fetchData("CODEFORCES");
  return codeArray;
}

module.exports = { codechefHandler, codeforcesHandler, hackerearthHandler };
