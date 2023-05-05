/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#farmers_markets");
  console.log(typeof(target));
  target.innerHTML = "";
  list.forEach((item, index) => {
    /* string that supplies us restaurant name */
    const str = `<li>${item.market_name}</li>`;
    target.innerHTML += str;
  });
}

function initChart(chart) {
  labels = ['bakedgoods', 
            'cheese', 
            'crafts', 
            'flowers', 
            'eggs', 
            'seafood', 
            'herbs', 
            'vegetables', 
            'honey', 
            'jams', 
            'maple', 
            'meat', 
            'nursery', 
            'nuts', 
            'plants', 
            'poultry', 
            'prepared', 
            'soap', 
            'trees', 
            'wine'];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [0, 10, 5, 2, 20, 30, 45],
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {},
  };

  return new Chart(
    chart,
    config
  );
}

function chartData(array) {

}

async function mainEvent() {
  const loadDataButton = document.querySelector("#data_load");
  const clearDataButton = document.querySelector("#data_clear");
  const generateListButton = document.querySelector("#generate");
  const textField = document.querySelector("#resto");
  const chartTarget = document.querySelector("#myChart");

  const loadAnimation = document.querySelector("#data_load_animation");
  loadAnimation.style.display = "none";
  generateListButton.classList.add("hidden");

  const storedData = localStorage.getItem("storedData");
  let parsedData = JSON.parse(storedData);
  if (parsedData?.length > 0) {
    generateListButton.classList.remove("hidden");
  }

  const chartData = parsedData;
  for (let i = 0; i < chartData.length; i++) {
    
  }
  chartLabels = getLabels(parsedData, "market_name");
  initChart(chartTarget, chartLabels);

  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  loadDataButton.addEventListener("click", async (submitEvent) => {
    // async has to be declared on every function that needs to "await" something

    // This prevents your page from becoming a list of 1000 records from the county, even if your form still has an action set on it
    submitEvent.preventDefault();

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
    console.log(storedList);
    localStorage.setItem("storedData", JSON.stringify(storedList));
    parsedData = storedList;

    const chartData = parsedData;

    if (storedList?.length > 0) {
      generateListButton.classList.remove("hidden");
    }

    loadAnimation.style.display = "none";
    console.table(storedList);
    injectHTML(storedList);
  });

//   generateListButton.addEventListener("click", (event) => {
//     console.log("generate new list");
//     currentList = cutRestaurantList(parsedData);
//     console.log(currentList);
//     injectHTML(currentList);
//   });

  // textField.addEventListener("input", (event) => {
  //   console.log("input", event.target.value);
  //   const newList = filterList(currentList, event.target.value);
  //   console.log(newList);
  //   injectHTML(newList);
  // });

  // clearDataButton.addEventListener("click", (event) => {
  //   console.log('clear browser data');
  //   localStorage.clear();
  //   console.log('localStorage Check', localStorage.getItem("storedData"))
  // })
}

/*
    This adds an event listener that fires our main event only once our page elements have loaded
    The use of the async keyword means we can "await" events before continuing in our scripts
    In this case, we load some data when the form has submitted
  */
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
