/*
 *
 *
 */

//'use strict';
/* jslint browser: true */
/* jslint plusplus: true */
/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", {allow: ["log"]}] */
/* eslint-env browser*/

/*
var fs = require('fs');
var d3 = require('d3');
var $ = require('jquery');
var ctx = require('chart');
var interpolate = require('color-interpolate);
*/


var i = 0, k = 0, data,
    consumption, consumption_imported, electricity, gas, water,
    electricityDats, gasDats, waterDats,
    electricDatsColors, gasDatsColors, waterDatsColors,
    electricTarget, gasTarget, waterTarget,
    year, yearsList = ["2013", "2014", "2015", "2016", "2017"],
    monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
    // Chart variables
    chartsMap = {},
    chartType = 'line',
    chartsList = ["electricityChart", "gasChart", "waterChart"],
    chartNames = {
        "electricityChart": "Campuswide Electricty (GWh)",
        "gasChart": "Campuswide Natural Gas (Therms)",
        "waterChart": "Campuswide Water (MG)"
    },
    //Constructors
    UtilityObj,
    ElectricityObj,
    GasObj,
    WaterObj;

chartsMap = {
    "electricityChart": 0,
    "gasChart": 0,
    "waterChart": 0
};



// Constructors 
// ******************************************************************//
UtilityObj = function UtilityObj() {
    this["2013"] = [];
    this["2014"] = [];
    this["2015"] = [];
    this["2016"] = [];
    this["2017"] = [];
    //this["2018"] = [];
};

ElectricityObj = function ElectricityObj() {
    this["SFIA Direct(kWh)"] = 0;
    this["Data Center (kWh)"] = 0;
    this["Community College (kWh)"] = 0;
    this["Settle Tenant (kWh)"] = 0;
    this["Non-Settle Tenant (kWh)"] = 0;
    this["Usage Meter (kWh)"] = 0;
    this["Renewable Generation Recorded (kWh)"] = 0;
    this["Airport Total (kWh)"] = 0;
    this["Airport + Data Center + Community College Total (kWh)"] = 0;
    this["Tenant Total (kWh)"] = 0;
    this["Sum of Total (kWh)"] = 0;
};

GasObj = function GasObj() {
    this["Sum of Total ($)"] = 0;
    this["Central Plant (Therms)"] = 0;
    this["Terminal Gas (Therms)"] = 0;
    this["Commission Gas (Therms)"] = 0;
    this["Tenant Gas (Therms)"] = 0;
    this["Non-Terminal Gas (Therms)"] = 0;
    this["Total (Therms)"] = 0;
    this["Total (kWh)"] = 0;
};

WaterObj = function WaterObj() {
    this.Domestic = 0;
    this["Double-counting Adjustment"] = 0;
    this["Domestic (Adjusted)"] = 0;
    this["Cooling Tower"] = 0;
    this.Irrigation = 0;
    this["Sewage Treatment"] = 0;
    this["Construction/Hydrant"] = 0;
    this["General Maintenance"] = 0;
    this["United MOC"] = 0;
    this["United Hub"] = 0;
    this["United T3 Hub"] = 0;
    this["United  GSE"] = 0;
    this.Hertz = 0;
    this["Gate Gourmet"] = 0;
    this["Post Office"] = 0;
    this["Rental Car Agencies"] = 0;
    this["Other Tenants"] = 0;
    this["All Rental Car"] = 0;
    this["Fire Protection/Maintenance"] = 0;
    this.Flushing = 0;
    this.Leakage = 0;
    this["Airport Subtotal"] = 0;
    this["Airport Subtotal (Adjusted)"] = 0;
    this["Airport Sub Net RSA"] = 0;
    this["Airport Sub Net RSA (Adjusted) + Unmetered"] = 0;
    this["Tenant Subtotal"] = 0;
    this["Unmetered Subtotal"] = 0;
    this["Total Consumption"] = 0;
    this["Total (Sum of Subtotal)"] = 0;
    this["Normalized Days"] = 0;
    this["Days in Billing Cycle"] = 0;
};

data = {
    "e": new UtilityObj(),
    "g": new UtilityObj(),
    "w": new UtilityObj()
};

electricity = new UtilityObj();
electricityDats = new UtilityObj();
gas = new UtilityObj();
gasDats = new UtilityObj();
water = new UtilityObj();
waterDats = new UtilityObj();

electricDatsColors = ["#000000", "#d9f2d9", "#b3e6b3", "#66cc66", "#339933", "#808080"];
gasDatsColors = ["#000000", "#ffcccc", "#ff9999", "#ff3333", "#cc0000", "#808080"];
waterDatsColors = ["#000000", "#ccccff", "#9999ff", "#3333ff", "#0000cc", "#808080"];

// use Charts.js to build main charts
function chartInit(chartID) {
    var dats = new UtilityObj(), datsColors = [], target;
    
    switch (chartID) {
        case "electricityChart":
            datsColors = ["#000000", "#d9f2d9", "#b3e6b3", "#66cc66", "#339933", "#808080"];
            target = 0.9;
            break;
        case "gasChart":
            datsColors = ["#000000", "#ffcccc", "#ff9999", "#ff3333", "#cc0000", "#808080"];
            target = 0.9;
            break;
        case "waterChart":
            datsColors = ["#000000", "#ccccff", "#9999ff", "#3333ff", "#0000cc", "#808080"];
            target = 0.9;
            break;
        default:
            alert("Error getting data for charts!");
    }
    
    for (year = 0; year < yearsList.length; year++) {
        for (i = 0; i < 12; i++) {
            switch (chartID) {
                case "electricityChart":
                    dats[yearsList[year]][i] = data.e[yearsList[year]][i]["Sum of Total (kWh)"];
                    break;
                case "gasChart":
                    dats[yearsList[year]][i] = data.g[yearsList[year]][i]["Total (Therms)"];
                    break;
                case "waterChart":
                    dats[yearsList[year]][i] = data.w[yearsList[year]][i]["Total Consumption"];
                    break;
                default:
                    alert("Error getting data for charts!");
            }
        }
    }
    
    var targetDats = [], q = 0;
    
    for (var counter in dats["2013"]) {
        targetDats[q] = dats["2013"][counter]*target;
        q++;
    }
    
    var ctx = document.getElementById(chartID);
    chartsMap[chartID] = new Chart(ctx, {
        type: chartType,
        data: {
            labels: monthList,
            datasets: [{
                label: "2013",
                data: dats["2013"],
                lineTension: 0,
                backgroundColor: 'transparent',
                borderColor: datsColors[0],
                borderWidth: 1,
                pointBackgroundColor: datsColors[0]
            },
           {
               label: "2014",
               data: dats["2014"],
               lineTension: 0,
               hidden: true,
               backgroundColor: 'transparent',
               borderColor: datsColors[1],
               borderWidth: 1,
               pointBackgroundColor: datsColors[1]
            },
           {
               label: "2015",
               data: dats["2015"],
               lineTension: 0,
               hidden: true,
               backgroundColor: 'transparent',
               borderColor: datsColors[2],
               borderWidth: 1,
               pointBackgroundColor: datsColors[2]
            },
           {
               label: "2016",
               data: dats["2016"],
               lineTension: 0,
               hidden: true,
               backgroundColor: 'transparent',
               borderColor: datsColors[3],
               borderWidth: 1,
               pointBackgroundColor: datsColors[3]
            },
           {
               label: "2017",
               data: dats["2017"],
               lineTension: 0,
               backgroundColor: 'transparent',
               borderColor: datsColors[4],
               borderWidth: 1,
               pointBackgroundColor: datsColors[4]
            },
           {
               label: "Target",
               data: targetDats,
               lineTension: 0,
               backgroundColor: 'transparent',
               borderColor: datsColors[5],
               borderWidth: 1,
               borderDash: [5,5],
               pointBackgroundColor: datsColors[5]
            },]
        },
        options: {
            layout: {
                padding: {
                    top: 20,
                    right: 20
                }
            },
            title: {
                display: true,
                text: chartNames[chartID]
            },
            tooltips: {
                // Add commas to tooltips
                callbacks: {
                    title: function(tooltipItem, data) {
                        return tooltipItem[0].xLabel + " " + data.datasets[tooltipItem[0].datasetIndex].label;
                    },
                    label: function(tooltipItem, data) {
                        // FIX THIS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                        var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        console.log(data);
                        console.log(tooltipItem);
                        if(parseInt(value) >= 1000){
                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        } else {
                           return value;
                        }
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        // Add commas tp scale bars
                        callback: function(value, index, values) {
                            if(parseInt(value) >= 1000){
                               return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            } else {
                               return value;
                            }
                       }     
                    }
                }]
            },
            legend: {
                display: true
            }
        }
    });
    ctx.style.backgroundColor = "#fff";
}

// use gauge.js to create gauge by ID
function gaugeInit(gaugeID, dats) {
    var opts = {
        angle: 0.0, // The span of the gauge arc
        lineWidth: 0.35, // The line thickness
        radiusScale: .75, // Relative radius
        pointer: {
            length: 0.6, // // Relative to gauge radius
            strokeWidth: 0.035, // The thickness
            color: '#000000' // Fill color
        },
        limitMax: false,     // If false, max value increases automatically if value > maxValue
        limitMin: false,     // If true, the min value of the gauge will be fixed
        /*colorStart: '#6FADCF',   // Colors
        colorStop: '#8FC0DA',    // just experiment with them
        strokeColor: '#E0E0E0',  // to see which ones work best for you*/
        //generateGradient: true,
        highDpiSupport: true,     // High resolution support
        //percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]],
        staticLabels: {
            font: "12px sans-serif",  // Specifies font
            labels: [70, 100, 130],  // Print labels at these values
            color: "#000000",  // Optional: Label text color
            fractionDigits: 0  // Optional: Numerical precision. 0=round off.
        },
        staticZones: [
            {strokeStyle: "#30B32D", min: 60, max: 92}, // Green from 60 to 92
            {strokeStyle: "#FFDD00", min: 92, max: 105}, // Yellow from 92 to 105
            {strokeStyle: "#F03E3E", min: 105, max: 140} // Red from 105 to 140
        ],
        renderTicks: {
            divisions: 4,
            divWidth: 1.1,
            divLength: 0.7,
            divColor: "#333333",
            subDivisions: 2,
            subLength: 0.5,
            subWidth: 0.6,
            subColor: "#666666"
        }
    };
    var target = document.getElementById(gaugeID); // your canvas element
    var gauge = new Gauge(target).setOptions(opts); // create pretty gauge!
    
    gauge.maxValue = 140; // set max gauge value
    gauge.setMinValue(60);  // Prefer setter over gauge.minValue = 0
    gauge.animationSpeed = 34; // set animation speed (32 is default value)
    gauge.set(92); // set actual value
}

$.when(
    $.getJSON('https://raw.githubusercontent.com/bgould132/Dashboard/master/data/consumption-min.json', function (consumption_imported) {
        consumption = consumption_imported;
    })
).then(function () {
    k = 0;
    
    for (year = 0; year < yearsList.length; year++) {
        for (i = 0; i < 12; i++) {
            data.e[yearsList[year]][i] = new ElectricityObj;
            data.g[yearsList[year]][i] = new GasObj;
            data.w[yearsList[year]][i] = new WaterObj;
        }
    }
        
    for (i = 0; i < consumption.length; i++) {
        var datum = consumption[i];
        var mon = datum.Month-1;
        
        console.log(consumption[i].Year);
        console.log(datum.Month);
        console.log(mon);
        
        for (var eData in data.e[datum.Year][mon]) {
            data.e[datum.Year][mon][eData] = datum[eData];
        }
        
        for (var gData in data.g[datum.Year][mon]) {
            data.g[datum.Year][mon][gData] = datum[gData];
        }
        
        for (var wData in data.w[datum.Year][mon]) {
            data.w[datum.Year][mon][wData] = datum[wData];
        }
        
        k++;
    }
        
    chartInit("electricityChart");
    chartInit("gasChart");
    chartInit("waterChart");
    
    gaugeInit("electricityGauge");
    gaugeInit("gasGauge");
    gaugeInit("waterGauge");
    
})

function typeToggle(type) {
    chartType = type;
    
    for (i = 0; i < chartsList.length; i++) {
        chartsMap[chartsList[i]].destroy();
    }
    
    chartInit("electricityChart");
    chartInit("gasChart");
    chartInit("waterChart");
    
    if (type === 'bar') {
        for (i = 0; i < chartsList.length; i++) {
            chartsMap[chartsList[i]].data.datasets.forEach(function (dataset) {
                dataset.backgroundColor = dataset.borderColor;                
            });
            chartsMap[chartsList[i]].update();
        }
    }
}