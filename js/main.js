/*
 *
 *
 */

//'use strict';
/* jslint browser: true */
/* jslint plusplus: true */
/* eslint no-unused-vars: ["error", {"args": "none"}] */
/* eslint no-console: ["error", {allow: ["log"]}] */
/* eslint no-undef: ["error", {allow: ["$"]}] */
/* eslint-env browser*/

/*
var fs = require('fs');
var d3 = require('d3');
var $ = require('jquery');
var ctx = require('chart');
var interpolate = require('color-interpolate);
*/


var i = 0, k = 0, data,
    passengers, consumption,
    year, yearsList = ["2013", "2014", "2015", "2016", "2017"],
    monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
    // Chart variables
    chartsMap = {},
    chartType = 'line',
    chartData = "monthly",
    chartsList = ["electricityChart", "gasChart", "waterChart"],
    chartNames = {
        "electricityChart": "Campuswide Electricty (GWh)",
        "gasChart": "Campuswide Natural Gas (Therms) (thousands)",
        "waterChart": "Campuswide Water (MG)"
    },
    //Constructors
    AnnualObj,
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
AnnualObj = function AnnualObj() {
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
    "e": new AnnualObj(), // electricity
    "g": new AnnualObj(), // natural gas
    "w": new AnnualObj(), // water
    "p": new AnnualObj() // passengers
};

function numberWithCommas (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// use Charts.js to build main charts
function chartInit(chartID) {
    var dats = new AnnualObj(), datsColors = [], target, builtDataset = [];
    
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
            alert("Error getting colors and targets for charts!");
    }
    
    for (year = 0; year < yearsList.length; year++) {
        for (i = 0; i < 12; i++) {
            switch (chartID) {
                case "electricityChart":
                    if (chartData === "monthly") {
                        dats[yearsList[year]][i] = data.e[yearsList[year]][i]["Sum of Total (kWh)"]/1000000;
                    } else if (chartData === "YTD") {
                        dats[yearsList[year]][i] = data.e[yearsList[year]][i].YTD/1000000;
                        console.log(dats);
                    }
                    break;
                case "gasChart":
                    if (chartData === "monthly") {
                        dats[yearsList[year]][i] = data.g[yearsList[year]][i]["Total (Therms)"]/1000;
                    } else if (chartData === "YTD") {
                        dats[yearsList[year]][i] = data.g[yearsList[year]][i].YTD/1000;
                    }
                    
                    break;
                case "waterChart":
                    if (chartData === "monthly") {
                        dats[yearsList[year]][i] = data.w[yearsList[year]][i]["Total Consumption"];
                    } else if (chartData === "YTD") {
                        dats[yearsList[year]][i] = data.w[yearsList[year]][i].YTD;
                    }
                    
                    break;
                default:
                    alert("Error getting data for charts!");
            }
        }
        builtDataset[year] = {
            label: yearsList[year],
            data: dats[yearsList[year]],
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: datsColors[year],
            borderWidth: 1,
            pointBackgroundColor: datsColors[year]
        }
        
        if (year != 0 && year != yearsList.length - 1) {
            builtDataset[year].hidden = true;
        }
    }
    
    var targetDats = [], q = 0;
    
    for (var counter in dats["2013"]) {
        targetDats[q] = dats["2013"][counter]*target;
        q++;
    }
    
    builtDataset[year] = {
        label: "Target",
        data: targetDats,
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: datsColors[year],
        borderWidth: 1,
        borderDash: [5,5],
        pointBackgroundColor: datsColors[year]
    }
    
    var ctx = document.getElementById(chartID);
    chartsMap[chartID] = new Chart(ctx, {
        type: chartType,
        data: {
            labels: monthList,
            datasets: builtDataset
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
                
                callbacks: {
                    // Add year to tooltip
                    title: function(tooltipItem, data) {
                        return tooltipItem[0].xLabel + " " + data.datasets[tooltipItem[0].datasetIndex].label;
                    },
                    // Add commas to tooltips
                    label: function(tooltipItem, data) {
                        var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
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
                        // Add commas to scale bars
                        callback: function(value, index, values) {
                            return numberWithCommas(value);
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
function gaugeInit(gaugeID) {
    var pct = 0;
    
    switch (gaugeID) {
        case "electricityGauge":
            pct = 0.9;
            break;
        case "gasGauge":
            pct = 0.9;
            break;
        case "waterGauge":
            pct = 0.9;
            break;
        default:
            alert("Error getting data for gauge percentages!");
    }
    
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
            labels: [70, (100*pct), ((100-(100*pct))+100), 130],  // Print labels at these values
            color: "#000000",  // Optional: Label text color
            fractionDigits: 0  // Optional: Numerical precision. 0=round off.
        },
        staticZones: [
            {strokeStyle: "#30B32D", min: 60, max: (100*pct)}, // Green from 60 to target
            {strokeStyle: "#FFDD00", min: (100*pct), max: ((100-(100*pct))+100)}, // Yellow from target to 100 + (100-target)
            {strokeStyle: "#F03E3E", min: ((100-(100*pct))+100), max: 140} // Red from 105 to 140
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
   // gauge.setTextField(document.getElementByID(gaugeID + "Text"));
    
    var set = 0;
    
    for (i = 0; i < 12; i++) {
        switch (gaugeID) {
            case "electricityGauge":
                set = (data.e.YTD/data.e["2013YTD"]*100);
                break;
            case "gasGauge":
                set = (data.g.YTD/data.g["2013YTD"]*100);
                break;
            case "waterGauge":
                set = (data.w.YTD/data.w["2013YTD"]*100);
                break;
            default:
                alert("Error getting data for charts!");
        }
    }
        
    gauge.set(set); // set actual value
    $("#" + gaugeID + "Text").text(set.toFixed(1) + "%");
}

$.when(
    $.getJSON('https://raw.githubusercontent.com/bgould132/Dashboard/master/data/consumption-min.json', function (consumption_imported) {
        consumption = consumption_imported;
    })//,
    /*$.getJSON('https://data.sfgov.org/resource/rptz-7xyh.json?$$app_token=D9qGwevI7VXD5MUOm2qa7mqhY', function (passengers_imported) {
        passengers = passengers_imported;
    })*/
    
).then(function () {
    //Clean consumption data
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
    
    
    //Clean passenger data
    for (year = 0; year < yearsList.length; year++) {
        for (i = 0; i < 12; i++) {
            data.p[yearsList[year]][i] = 0;
        }
    }
    
    var month = 0;
    
    /*
    for (i = 0; i < passengers.length; i++) {
        year = passengers[i]["activity_period"].slice(0, 4);
        console.log(year);
        if (parseInt(year) >= 2013 && (passengers[i]["activity_type_code"] === "Deplaned" || passengers[i]["activity_type_code"] === "Enplaned")) {
            month = parseInt(passengers[i]["activity_period"].slice(4, 6));
            data.p[year][month] += parseInt(passengers[i]["passenger_count"]);
        }
    }
    */
    // Generate charts
    chartInit("electricityChart");
    chartInit("gasChart");
    chartInit("waterChart");
    
    // Build YTD data for charts
    for (year = 0; year < yearsList.length; year++) {        
        for (i = 0; i < data.e[yearsList[year]].length; i++) {            
            if (i === 0) {
                data.e[yearsList[year]][i].YTD = data.e[yearsList[year]][i]["Sum of Total (kWh)"];
                data.g[yearsList[year]][i].YTD = data.g[yearsList[year]][i]["Total (Therms)"];
                data.w[yearsList[year]][i].YTD = data.w[yearsList[year]][i]["Total Consumption"];
            } else {
                data.e[yearsList[year]][i].YTD = data.e[yearsList[year]][i-1].YTD + data.e[yearsList[year]][i]["Sum of Total (kWh)"];
                
                data.g[yearsList[year]][i].YTD = data.g[yearsList[year]][i-1].YTD + data.g[yearsList[year]][i]["Total (Therms)"];
                
                data.w[yearsList[year]][i].YTD = data.w[yearsList[year]][i-1].YTD + data.w[yearsList[year]][i]["Total Consumption"];
            }
        }
    }
    
    // Generate total YTD numbers for use in cards
    data.e.YTD = 0;
    data.g.YTD = 0;
    data.w.YTD = 0;
    data.e["2013YTD"] = 0;
    data.g["2013YTD"] = 0;
    data.w["2013YTD"] = 0;
    
    year = yearsList.length - 1;
    
    for (i = 0; i < data.e[yearsList[year]].length; i++) {
        data.e.YTD += data.e[yearsList[year]][i]["Sum of Total (kWh)"];
        data.e["2013YTD"] += data.e["2013"][i]["Sum of Total (kWh)"];
        
        data.g.YTD += data.g[yearsList[year]][i]["Total (Therms)"];
        data.g["2013YTD"] += data.g["2013"][i]["Total (Therms)"];
        
        data.w["2013YTD"] += data.w["2013"][i]["Total Consumption"];
        data.w.YTD += data.w[yearsList[year]][i]["Total Consumption"];
        
    }
    
    // Update card text with numerical data
    $("#eYTD").text(numberWithCommas(parseInt(data.e.YTD/1000000)) + " GWh");
    $("#e2013YTD").text(numberWithCommas(parseInt(data.e["2013YTD"]/1000000)) + " GWh");
    $("#eEquiv").text(numberWithCommas(parseInt((data.e["2013YTD"] - data.e.YTD)/6887.170149)) + " CA homes powered");
    
    $("#gYTD").text(numberWithCommas(parseInt(data.g.YTD/1000)) + " kTherms");
    $("#g2013YTD").text(numberWithCommas(parseInt(data.g["2013YTD"]/1000)) + " kTherms");
    $("#gEquiv").text(numberWithCommas(parseInt((data.g["2013YTD"] - data.g.YTD)*13.446/10361.7)) + " cars off the road");
    
    $("#wYTD").text(numberWithCommas(parseInt(data.w.YTD)) + " MG");
    $("#w2013YTD").text(numberWithCommas(parseInt(data.w["2013YTD"])) + " MG");
    $("#wEquiv").text(numberWithCommas(parseInt((data.w["2013YTD"] - data.w.YTD)*1000000/18250)) + " Water-Efficient Homes");
        
    
    // Generate gauges
    gaugeInit("electricityGauge");
    gaugeInit("gasGauge");
    gaugeInit("waterGauge");
    
    $(".currentYear").text(yearsList[yearsList.length-1])
    
})

function typeToggle(type) {
    chartType = type;
    
    switch (type) {
        case 'line':
            $("#lineChart").addClass("active");
            $("#barChart").removeClass("active");
            break;
        case 'bar':
            $("#lineChart").removeClass("active");
            $("#barChart").addClass("active");
            break;
        default:
            alert("Error toggling display!");
    }
    
    destroyCharts();
    initCharts();
    barCheck();
    
    
}

function dataToggle(dat) {
    switch (dat) {
        case 'monthly':
            chartData = "monthly";
            $("#monthlyData").addClass("active");
            $("#yearlyData").removeClass("active");
            break;
        case 'YTD':
            chartData = "YTD";
            $("#monthlyData").removeClass("active");
            $("#yearlyData").addClass("active");
            break;
        default:
            alert("Error toggling data!");
    }
    
    destroyCharts();
    initCharts();
    barCheck();
}

function initCharts() {
    for (var q = 0; q < chartsList.length; q++) {
        chartInit([chartsList[q]].toString());
    }
}

function destroyCharts() {
    for (i = 0; i < chartsList.length; i++) {
        chartsMap[chartsList[i]].destroy();
    }
}

function barCheck() {
    if (chartType === 'bar') {
        for (i = 0; i < chartsList.length; i++) {
            chartsMap[chartsList[i]].data.datasets.forEach(function (dataset) {
                dataset.backgroundColor = dataset.borderColor;                
            });
            chartsMap[chartsList[i]].update();
        }
    }
}