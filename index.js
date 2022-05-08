const hrHand = document.querySelector(".hr-hand");
const minHand = document.querySelector(".min-hand");
const secHand = document.querySelector(".sec-hand");
const zone = document.getElementById("zone");

const display = document.querySelector(".time-zone-div");
const list = document.querySelector(".time-zone-list");
const ul = document.querySelector(".time-zone-list ul");

const listItem = document.createElement("li");
listItem.textContent = "YAHo";

display.addEventListener("click", () => {
  list.style.display = "block";
  console.log("click");
});

// ul.addEventListener("click", (e) => {
//   console.log(e.target);
// });

let timezone = ["Asia/Kolkata"];
const z = [];

let date = new Date();
let hrs = date.getHours();
let min = date.getMinutes();
let seconds = date.getSeconds();

getAllTimeZones();

async function getAllTimeZones() {
  timezone = await fetch("https://worldtimeapi.org/api/timezone/").then((val) =>
    val.json()
  );
  timezone = timezone.filter((i) => i !== "Asia/Kolkata");
  timezone.unshift("Asia/Kolkata");
  console.log(timezone);
  fillSelect();
}

function createSelectItem(timezone) {
  // const selectItem = document.createElement("option");
  // selectItem.textContent = timezone["city"];
  // selectItem.setAttribute("name", timezone["continent"]);
  // selectItem.setAttribute("id", "some");
  // zone.appendChild(selectItem);
  const listItem = document.createElement("li");
  listItem.textContent = timezone["city"];
  ul.appendChild(listItem);
}

function fillSelect() {
  if (timezone.length > 0) {
    for (let i of timezone) {
      let city = i.split("/")[2] ? i.split("/")[2] : i.split("/")[1];
      if (city !== undefined && city.includes("_")) {
        city = city.replace(/_/g, " ");
        // console.log(city);
      }
      const continent = i.split("/")[0];
      const town = i.split("/")[2] ? i.split("/")[1] : "";
      if (city !== undefined && continent !== undefined) {
        // console.log({ city: city, continent: continent, town: town
        z.push({ city: city, continent: continent, town: town });
        createSelectItem({
          city: city,
          continent: continent,
          town: town ? town : undefined,
        });
      }
    }
  }
}

list.addEventListener("click", (e) => {
  city = e.target.textContent;
  console.log(city);
  continent = z
    .map((val) => {
      if (val["city"] === city) {
        return val;
      }
    })
    .filter((val) => val !== undefined);

  fetchData(continent[0]);
  if (city.length < 100) {
    display.textContent = city;
  }
  list.style.display = "none";
});

// hrHand.style.transform = "rotateZ(90deg) translate(0,0)";
// minHand.style.transform = "rotateZ(0deg) translate(0,0)";

const fetchData = async (timeZone) => {
  // console.log(typeof timeZone["town"]);
  // console.log(timeZone);
  let city = timeZone["city"];
  if (city.includes(" ")) {
    city = city.replace(/ /, "_");
    // console.log(city);
  }
  const res = await fetch(
    `http://worldtimeapi.org/api/${timeZone["continent"]}/${
      timeZone["town"] !== "" ? timeZone["town"] : ""
    }/${city}`
  ).then((response) => response.json());
  date = res.datetime;

  let offset = res.utc_offset.slice(1).split(":");
  const time = new Date(date).toLocaleTimeString("en", {
    timeStyle: "full",
    hour12: false,
    timeZone: "UTC",
  });
  // console.log(time, offset);
  t = time.slice(0, 8).split(":");

  seconds = 0;
  hrs = parseInt(t[0]) + parseInt(offset[0]);
  min = parseInt(t[1]) + parseInt(offset[1]);

  if (min > 60) {
    min = min - 60;
    hrs++;
  }
  if (hrs > 12) {
    hrs = hrs - 12;
  }

  // console.log(hrs, min, seconds);

  // hrs = date.getHours();
  // min = date.getMinutes();
  // seconds = date.getSeconds();
};

setInterval(() => {
  seconds = seconds + 1;
  // min = (min * seconds) / 60;
  // hrs = (hrs * seconds) / 3600;
  secHand.style.transform = `rotateZ(${seconds * 6}deg) translate(0,0)`;
  minHand.style.transform = `rotateZ(${
    min * 6 + seconds * 0.1
  }deg) translate(0,0)`;
  hrHand.style.transform = `rotateZ(${
    hrs * 30 + min * 0.5 + seconds * 0.008
  }deg) translate(0,0)`;
}, 1000);

// console.log(time);
// const seconds = (time / 1000);
