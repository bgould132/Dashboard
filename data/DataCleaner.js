//'use strict';
/*jslint plusplus: true */

var fs = require('fs');
var d3 = require('d3');
var $ = require('jquery');

var writeFile, spacing, data, cleanData, i, j;

function writePrivate(dat, name) {
    writeFile = './' + name + '.json';
    spacing = 4;

    fs.writeFileSync(writeFile, JSON.stringify(dat, null, spacing));
    console.log('Readable JSON saved to ' + writeFile);
}

function writePublic(dat, name) {
    writeFile = './' + name + '-min.json';
    spacing = 0;

    fs.writeFileSync(writeFile, JSON.stringify(dat, null, spacing));
    console.log('Concise JSON saved to ' + writeFile);
}

function writeAll(dat, name) {
    writePrivate(dat, name);
    writePublic(dat, name);
}

function dataLoad() {
    data = d3.csvParse((fs.readFileSync('./consumption.csv')).toString());
    cleanData = [];
    
    for (i = 0; i < data.length; i++) {
        cleanData[i] = JSON.parse(JSON.stringify(data[i]));
        for (var k in data[i]) {
            if (k === "Month" || k === "Year") {
                cleanData[i][k] = cleanData[i][k];
            } else {
                cleanData[i][k] = parseInt(data[i][k]);
            }
        }
        
        /*for (j = 0; j < data[i].length; j++) {
            if (j === 0) {
                cleanData[i][j] = JSON.parse(JSON.stringify(data[i][j]));
            } else {
                cleanData[i][j] = parseInt(data[i][j]);
            }
        }*/
    }
}

dataLoad();
writeAll(cleanData, "consumption");