/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#farmers_markets");
  target.innerHTML = "";
  list.forEach((item, index) => {
    /* string that supplies us restaurant name */
    const str = `<li>${item.market_name}</li>`;
    target.innerHTML += str;
  });
}

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.market_name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
  /*
      Using the .filter array method, 
      return a list that is filtered by comparing the item name in lower case
      to the query in lower case
      Ask the TAs if you need help with this
    */
}

function initChart(chart, chartLabels, chartDatapoints) {
  const data = {
    labels: labels,
    datasets: [
      {
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: chartDatapoints,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {},
  };
  barChart = new Chart(chart, config);
  return barChart;
}

function getChartData(arr, labels) {
  console.log(arr);
  keys = labels;
  entries = new Array(keys.length).fill(0);
  for (i = 0; i < arr.length; i++) {
    for (j = 0; j < keys.length; j++) {
      if (arr[i][keys[j]] == "Yes") {
        entries[i]++;
      }
    }
  }
  entries.pop();
  const data = {};
  keys.forEach((element, index) => {
    data[element] = entries[index];
  });

  console.log(data);
  return data;
}

async function mainEvent() {
  // the async keyword means we can make API requests
  const loadDataButton = document.querySelector("#data_load");
  const clearDataButton = document.querySelector("#data_clear");
  const generateListButton = document.querySelector("#generate");
  const chartTarget = document.querySelector("#myChart");
  const textField = document.querySelector("#markets");
  // Add a querySelector that targets your filter button here

  const loadAnimation = document.querySelector("#data_load_animation");
  loadAnimation.style.display = "none";
  generateListButton.classList.add("hidden");

  const storedData = localStorage.getItem("storedData");
  let parsedData = JSON.parse(storedData);
  if (parsedData?.length > 0) {
    generateListButton.classList.remove("hidden");
  }

  let currentList = []; // this is "scoped" to the main event function

  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  loadDataButton.addEventListener("click", async (submitEvent) => {
    // async has to be declared on every function that needs to "await" something

    // this is substituting for a "breakpoint" - it prints to the browser to tell us we successfully submitted the form
    console.log("form submission");
    console.log("Loading data");
    loadAnimation.style.display = "inline-block";

    // Basic GET request - this replaces the form Action
    const results = await fetch(
      "https://data.princegeorgescountymd.gov/resource/sphi-rwax.json"
    );

    // This changes the response from the GET into data we can use - an "object"
    const storedList = await results.json();
    localStorage.setItem("storedData", JSON.stringify(storedList));
    parsedData = storedList;

    if (storedList?.length > 0) {
      generateListButton.classList.remove("hidden");
    }

    loadAnimation.style.display = "none";
    console.table(storedList);
    injectHTML(storedList);

    const chartData = parsedData;

    // tried to make a function to automate the creation of these labels, but I realized thatit was useless as if
    // I am handpicking which lables I want anyway, it's a waste of time and doesn't make sense.

    labels = [
      "bakedgoods",
      "cheese",
      "crafts",
      "flowers",
      "eggs",
      "seafood",
      "herbs",
      "vegetables",
      "honey",
      "jams",
      "maple",
      "meat",
      "nursery",
      "nuts",
      "plants",
      "poultry",
      "prepared",
      "soap",
      "trees",
      "wine",
    ];
    chartLabels = labels;
    chartDatapoints = getChartData(chartData, labels);
    initChart(chartTarget, chartLabels, chartDatapoints);
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    console.log(parsedData);
    currentList = parsedData;
    console.log(currentList);
    injectHTML(currentList);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    currentList = parsedData;
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    barChart.destroy();
    chartDatapoints = getChartData(newList, labels);
    initChart(chartTarget, chartLabels, chartDatapoints);
    injectHTML(newList);
  });

  clearDataButton.addEventListener("click", (event) => {
    console.log("clear browser data");
    localStorage.clear();
    console.log("localStorage Check", localStorage.getItem("storedData"));
  });
}

/*
    This adds an event listener that fires our main event only once our page elements have loaded
    The use of the async keyword means we can "await" events before continuing in our scripts
    In this case, we load some data when the form has submitted
  */
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
