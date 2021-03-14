const url = "/events/hackerearths";
const fetchData = async () => {
  // let headers = new Headers();
  //
  // headers.append("Content-Type", "application/json");
  // headers.append("Accept", "application/json");

  // headers.append("Origin", "http://localhost:5000");

  await fetch(url, {
    method: "GET",
    // headers: headers,
  })
    .then((data) => {
      console.log(data.json());
    })
    .catch((e) => {
      console.log(e);
    });
};

fetchData();
