$(document).on('pageshow', '#index', function () {
    $(document).ready(function () {
        $.getJSON("/getStations.php", function (data) {
            var map = new GMaps({
                div: '#map',
                lat: data[0][2],
                lng: data[0][1]
            });
            for (var i = 0; i < data.length; i++) {
                map.addMarker({
                    lat: data[i][2],
                    lng: data[i][1],
                    title: data[i][6],
                    infoWindow: {
                        content: "<iframe src='http://www.cellwx.org/MapPopup.html?imei=" + data[i][0] + "'width='350' height='535'></iframe>"
                    }
                });
            }
        });
    });
});

