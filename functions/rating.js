let userData = { data: "", error: "" };
const fetch = require("node-fetch");
const fetchData = async (platform, username) => {
  const url = `https://competitive-coding-api.herokuapp.com/api/${platform}/${username}`;
  await fetch(url)
    .then((response) => response.json())
    .then((dataUser) => {
      if (dataUser.status === "Success") {
        userData = {
          data: dataUser,
        };
      } else {
        userData = {
          error: dataUser.details,
        };
      }
    })
    .catch((e) => {
      error: e;
    });
};
const fetchDataHackearth = async (platform, username) => {
  const url = `http://rating-wiz.herokuapp.com/hackerearth/${username}`;
  // console.log(url);
  await fetch(url)
    .then((response) => response.json())
    .then((dataUser) => {
      userData = {
        data: dataUser,
      };
    })
    .catch((e) => {
      userData = {
        error: "Invalid Username",
      };
    });
};

async function codechefRating(platform, username) {
  await fetchData(platform, username);
  return userData;
}

async function codeforcesRating(platform, username) {
  await fetchData(platform, username);
  return userData;
}

async function hackerearthRating(platform, username) {
  await fetchDataHackearth(platform, username);
  return userData;
}

module.exports = { hackerearthRating, codeforcesRating, codechefRating };
