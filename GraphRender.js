/* global info */

$.extend({
    getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function (name) {
        return $.getUrlVars()[name];
    }
});
var info;
$(document).on('pageshow', '#index', function () {

    var urlarray = $.getUrlVars('imei');
    var imei = parseInt(urlarray['imei']);

    $(document).ready(function () {

        $.getJSON("/getStationInfo.php?imei=" + imei, function (json) {
            info = json;
        });
        var d = new Date();
        var n = d.getTimezoneOffset();
        $(function () {
            Highcharts.setOptions({
                global: {
                    timezoneOffset: n
                }
            });
            $.getJSON('/getWindData.php?imei=' + imei, function (data) {

                // split the data set into ohlc and volume
                var temperature = [],
                        speed = [],
                        direction = [],
                        avgWind = [],
                        dataLength = data.length,
                        i = 0;
                for (i; i < dataLength; i += 1) {
                    if (i > 1) {
                        var timegap = data[i][1] - data[i - 1][1];
                        if (timegap > 3600000) {
                            var numGaps = timegap / 3600000;
                            var i2 = 0;
                            for (i2; i2 <= numGaps; i2 += 1) {
                                var date = data[i][1] + (3600000 * i2);
                                temperature.push([
                                    date, // the date
                                    null  //temperature
                                ]);
                                speed.push([
                                    date, // the date
                                    null, //minWindSpeed
                                    null  //maxWindSpeed
                                ]);
                                direction.push([
                                    date, //the date
                                    null  //windDir
                                ]);
                                avgWind.push([
                                    date, //date
                                    null  //avgWindSpeed
                                ]);
                            }
                        }
                    }
                    temperature.push([
                        data[i][1], // the date
                        data[i][6]  //temperature
                    ]);
                    speed.push([
                        data[i][1], // the date
                        data[i][2], //minWindSpeed
                        data[i][4]  //maxWindSpeed
                    ]);
                    direction.push([
                        data[i][1], //the date
                        data[i][5]  //windDir
                    ]);
                    avgWind.push([
                        data[i][1], //date
                        data[i][3]  //avgWindSpeed
                    ]);
                }

                // create the chart
                $('#container').highcharts('StockChart', {
                    chart: {
                        backgroundColor: '#F9F9F9',
                        borderColor: '#F9F9F9'
                    },
                    tooltip: {
                        dateTimeLabelFormats: {
                            millisecond: "%A, %b %e, %H:%M:%S",
                            second: "%A, %b %e, %H:%M:%S",
                            minute: "%A, %b %e, %H:%M",
                            hour: "%A, %b %e, %H:%M",
                            day: "%A, %b %e, %Y",
                            week: "Week from %A, %b %e, %Y",
                            month: "%B %Y",
                            year: "%Y"
                        }
                    },
                    rangeSelector: {
                        selected: 1
                    },
                    title: {
                        text: info[6]
                    },
                    yAxis: [{
                            labels: {
                                align: 'right',
                                x: -3
                            },
                            title: {
                                text: 'Air Temp (F)',
                                style: {
                                    color: '#CC0000'
                                }
                            },
                            height: '30%',
                            lineWidth: 2,
                            lineColor: '#CC0000'
                        }, {
                            labels: {
                                align: 'right',
                                x: -3
                            },
                            title: {
                                text: 'Wind Speed(mph)',
                                style: {
                                    color: '#7cb5ec'
                                }
                            },
                            top: '33%',
                            height: '30%',
                            offset: 0,
                            lineWidth: 2,
                            lineColor: '#7cb5ec'

                        }, {
                            labels: {
                                align: 'right',
                                x: -3
                            },
                            title: {
                                text: 'Wind Direction (Degrees)',
                                style: {
                                    color: '#33CC33'
                                }
                            },
                            plotBands: [{
                                    from: info[7],
                                    to: info[8],
                                    color: 'rgba(51, 204, 51, 0.2)',
                                    label: {
                                        text: 'Viable Wind Direction'
                                    }
                                }],
                            min: 0,
                            max: 359,
                            top: '66%',
                            height: '30%',
                            offset: 0,
                            lineWidth: 2,
                            lineColor: '#33CC33'
                        }],
                    xAxis: [{
                            breaks: [{
                                    breakSize: 3600000
                                }],
                            dateTimeLabelFormats: {
                                millisecond: '%H',
                                second: '%H',
                                minute: '%H',
                                hour: '%H',
                                day: '%H',
                                week: '%H',
                                month: '%H',
                                year: '%H'
                            }
                        }],
                    series: [{
                            type: 'line',
                            name: 'Air Temp',
                            tooltip: {
                                valueSuffix: ' °F'
                            },
                            data: temperature,
                            marker: {
                                enabled: true,
                                radius: 3
                            },
                            color: '#CC0000'
                        }, {
                            type: 'arearange',
                            name: 'Wind Speed',
                            tooltip: {
                                valueSuffix: ' mph'
                            },
                            data: speed,
                            marker: {
                                enabled: true,
                                radius: 3
                            },
                            yAxis: 1,
                            color: '#7CB5EC',
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1.5
                                },
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            }
                        }, {
                            type: 'line',
                            marker: {
                                enabled: true,
                                radius: 3
                            },
                            name: 'Avg. Wind Speed',
                            tooltip: {
                                valueSuffix: ' mph'
                            },
                            data: avgWind,
                            yAxis: 1,
                            color: '#000000'
                        }, {
                            type: 'line',
                            marker: {
                                enabled: true,
                                radius: 3
                            },
                            name: 'Wind Direction',
                            tooltip: {
                                valueSuffix: ' ° From N'
                            },
                            data: direction,
                            yAxis: 2,
                            color: '#33CC33'
                        }]
                });
            });
        });
    });
});