/*
 *
 *
 */

//'use strict';
/*jslint plusplus: true */

/*
var fs = require('fs');
var d3 = require('d3');
var $ = require('jquery');
var ctx = require('chart');
var interpolate = require('color-interpolate);
*/


var i = 0, k = 0, item,
    consumption, consumption_imported, electricity, gas, water,
    electricityDats, gasDats, waterDats,
    electricDatsColors, gasDatsColors, waterDatsColors,
    year, yearsList = ["2013", "2014", "2015", "2016", "2017"],
    // Chart variables
    chartsList = ["electricityChart", "gasChart", "waterChart"], 
    chartType = 'line',

    //Constructors
    UtilityObj,
    ElectricityObj,
    GasObj,
    WaterObj;

electricDatsColors = ["#000000", "#ffffb3","#ffff66", "#ffff33","#ffff00"];
gasDatsColors = ["#000000", "#ffcccc","#ff8080", "#ff3333","#ff0000"];
waterDatsColors = ["#000000", "#e6e6ff","#8080ff", "#4d4dff","#0000ff"];

// Constructors 
// ******************************************************************//
UtilityObj = function UtilityObj() {
    this["2013"] = [];
    this["2014"] = [];
    this["2015"] = [];
    this["2016"] = [];
    this["2017"] = [];
    //this["2018"] = [];
}

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
}

GasObj = function GasObj() {
    this["Sum of Total ($)"] = 0;
    this["Central Plant (Therms)"] = 0;
    this["Terminal Gas (Therms)"] = 0;
    this["Commission Gas (Therms)"] = 0;
    this["Tenant Gas (Therms)"] = 0;
    this["Non-Terminal Gas (Therms)"] = 0;
    this["Total (Therms)"] = 0;
    this["Total (kWh)"] = 0;
}

WaterObj = function WaterObj() {
    this["Domestic"] = 0;
    this["Double-counting Adjustment"] = 0;
    this["Domestic (Adjusted)"] = 0;
    this["Cooling Tower"] = 0;
    this["Irrigation"] = 0;
    this["Sewage Treatment"] = 0;
    this["Construction/Hydrant"] = 0;
    this["General Maintenance"] = 0;
    this["United MOC"] = 0;
    this["United Hub"] = 0;
    this["United T3 Hub"] = 0;
    this["United  GSE"] = 0;
    this["Hertz"] = 0;
    this["Gate Gourmet"] = 0;
    this["Post Office"] = 0;
    this["Rental Car Agencies"] = 0;
    this["Other Tenants"] = 0;
    this["All Rental Car"] = 0;
    this["Fire Protection/Maintenance"] = 0;
    this["Flushing"] = 0;
    this["Leakage"] = 0;
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
}

electricity = new UtilityObj;
electricityDats = new UtilityObj;
gas = new UtilityObj;
gasDats = new UtilityObj;
water = new UtilityObj;
waterDats = new UtilityObj;

// use Charts.js to build main charts
function mainChartInit(chartID, dats, datsColors) {
    var ctx = document.getElementById(chartID);
    var myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
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
                backgroundColor: 'transparent',
                borderColor: datsColors[1],
                borderWidth: 1,
                pointBackgroundColor: datsColors[1]
            },
           {
               label: "2015",
                data: dats["2015"],
                lineTension: 0,
                backgroundColor: 'transparent',
                borderColor: datsColors[2],
                borderWidth: 1,
                pointBackgroundColor: datsColors[2]
            },
           {
               label: "2016",
                data: dats["2016"],
                lineTension: 0,
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
            }]
        },
        options: {
            layout: {
                padding: {
                    top: 20,
                    right: 20
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
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

$.when(
    $.getJSON('https://raw.githubusercontent.com/bgould132/Dashboard/master/data/consumption-min.json', function (consumption_imported) {
        consumption = consumption_imported;
    })
).then(function () {
    k = 0;
    for (year = 0; year < yearsList.length; year++) {
        for (i = 0; i < 12; i++) {
            electricity[yearsList[year]][i] = new ElectricityObj;
            gas[yearsList[year]][i] = new GasObj;
            water[yearsList[year]][i] = new WaterObj;
            for (var electricItems in electricity[yearsList[year]][i]) {
                electricity[yearsList[year]][i][electricItems] = parseInt(consumption[k][electricItems]);
            }
            
            for (var gasItems in gas[yearsList[year]][i]) {
                gas[yearsList[year]][i][gasItems] = parseInt(consumption[k][gasItems]);
            }
            
            for (var waterItems in water[yearsList[year]][i]) {
                water[yearsList[year]][i][waterItems] = parseInt(consumption[k][waterItems]);
            }
            
            k++;
        }
        
        for (i = 0; i < 12; i++) {
            electricityDats[yearsList[year]][i] = parseInt(electricity[yearsList[year]][i]["Sum of Total (kWh)"]);
            gasDats[yearsList[year]][i] = parseInt(gas[yearsList[year]][i]["Total (Therms)"]);
            waterDats[yearsList[year]][i] = parseInt(water[yearsList[year]][i]["Total Consumption"]);
        }
        
    }
    
    mainChartInit("electricityChart", electricityDats, electricDatsColors);
    mainChartInit("gasChart", gasDats, gasDatsColors);
    mainChartInit("waterChart", waterDats, waterDatsColors);
})

