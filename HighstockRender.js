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

$(document).on('pageshow', '#index', function () {
        var urlarray = $.getUrlVars('imei');
        var imei = parseInt(urlarray['imei']);

    $(document).ready(function () {
        var name;
        $.getJSON("/getStationName.php?imei=" + imei, function (json) {
            name = json;
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
                        text: name
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
                                    from: 100,
                                    to: 180,
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
                    series: [{
                            type: 'line',
                            name: 'Air Temp',
                            tooltip: {
                                valueSuffix: ' °F'
                            },
                            data: temperature,
                            color: '#CC0000'
                        }, {
                            type: 'arearange',
                            name: 'Wind Speed',
                            tooltip: {
                                valueSuffix: ' mph'
                            },
                            data: speed,
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
                            name: 'Avg. Wind Speed',
                            tooltip: {
                                valueSuffix: ' mph'
                            },
                            data: avgWind,
                            yAxis: 1,
                            color: '#000000'
                        }, {
                            type: 'line',
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