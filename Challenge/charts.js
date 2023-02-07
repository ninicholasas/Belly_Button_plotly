function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
let dataSample = data.samples;
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
let filteredSample = dataSample.filter(x => x.id == sample);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
let metaData = data.metadata;
let filteredMeta = metaData.filter(sampleObj => sampleObj.id == sample);
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
let firstSample = filteredSample[0];
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
let firstMeta = filteredMeta[0];
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
let otuIds = firstSample.otu_ids;

let otuLabels = firstSample.otu_labels;

let sampleValue = firstSample.sample_values;
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    let washFreq = firstMeta.wfreq;

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    let yticks = otuIds.slice(0, 10).map(otuIds => `OTU ${otuIds}`).reverse();

    // Deliverable 1: 8. Create the trace for the bar chart. 
    let barData = [
      {
        x : sampleValue.slice(0, 10).reverse(),
        y : yticks,
        type : 'bar',
        orientation : 'h',
        text : otuLabels.slice(0, 10).reverse()
      }

    ];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    let barLayout = {
      title : 'Top 10 Bacteria Cultures Found'
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
    // Deliverable 2: 1. Create the trace for the bubble chart.
    let bubbleData = [
      {
        x : otuIds,
        y : sampleValue,
        text : otuLabels,
        mode : 'markers',
        marker : {
          size : sampleValue,
          color : otuIds,
          colorscale : 'Earth'
        }
      }
    ];
    // Deliverable 2: 2. Create the layout for the bubble chart.
    let bubbleLayout = {
      title : {text: 'Bacteria Cultures Per Sample', font:{size: 24}},
      xaxis : {title : 'OTU ID'}
    };
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    let gaugeData = [
      {
        type : 'indicator',
        mode : 'gauge+number',
        value : washFreq,
        title : { text: 'Belly Button Washing Frequency <br> Scrubs per Week', font: { size: 24}},
        gauge : {
          axis : {range: [0, 10], dtick: 2, tickcolor: 'darkgreen'},
          bar: {color: 'lightgray'},
          bgcolor: 'white',
          borderwidth: 2,
          bordercolor: 'gray',
          steps: [
            {range: [0, 2], color: 'darkred'},
            {range: [2, 4], color: 'red'},
            {range: [4, 6], color: 'purple'},
            {range: [6, 8], color: 'darkblue'},
            {range: [8, 10], color: 'blue'}
          ]
        }
      }
    ]
    // Deliverable 3: 5. Create the layout for the gauge chart.
    let gaugeLayout = {
      width: 500,
      height: 400,
      margin: {t: 25, r: 25, l: 25, b: 25},
      paper_bgcolor: 'lavendor',
      font: {color: 'darkblue', family: 'Arial'}
    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
