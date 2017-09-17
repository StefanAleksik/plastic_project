$(document).ready(function () {
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url: 'http://localhost:3000/data',
        success: function (data) {
            //console.log(data);
            sortData(data)


        },
        error: function (xhr,status,message) {
            alert("Can not reach the Registration Web Server");
            alert(JSON.stringify(xhr));
            alert(status);
            alert(message);
        }
    })
});

function convertDateTime(dateTime){
    dateTime = dateTime.split(" ");
    var date = dateTime[0].split(".");
    var yyyy = date[2];
    var mm = date[1];
    var dd = date[0];
    var time = dateTime[1].split(":");
    var h = time[0];
    var m = time[1];
    return new Date(yyyy,mm,dd,h,m);
}

function sortData(data) {
    var sortDates = data.sort(function (a, b) {
        a = new Date(convertDateTime(a['Starttid']));
        b = new Date(convertDateTime(b['Starttid']));
        return a - b;
    });
var Open1=[],
    Open4=[],
    Open5=[],
    Open6=[],
    WetEnd=[],
    PreDryer=[],
    AfterDryer=[],
    PopeReel=[],
    JumboBackStand=[],
    ReWinder=[];
    sortDates.forEach(function (p1, p2, p3) {
        switch (p1['M?tpunkt']){
            case 'Open1':
                Open1.push(p1);
            break;
            case 'Open4':
                Open4.push(p1);
                break;
            case 'Open5':
                Open5.push(p1);
                break;
            case 'Open6':
                Open6.push(p1);
                break;
            case '02 - Wet end':
                WetEnd.push(p1);
                break;
            case '05 - Pre-Dryer':
                PreDryer.push(p1);
                break;
            case '07 - After-Dryer':
                AfterDryer.push(p1);
                break;
            case '08 - Pope Reel':
                PopeReel.push(p1);
                break;
            case '09 - Jumbo Back Stand':
                JumboBackStand.push(p1);
                break;
            case '10 - Re Winder':
                ReWinder.push(p1);
                break;
            default:
                console.log('not an Open');
        }
    });
    var obj = {
        open1: Open1,
        open4: Open4,
        open5: Open5,
        open6: Open6,
        wetEnd: WetEnd,
        preDry: PreDryer,
        afterDry: AfterDryer,
        popReel: PopeReel,
        jumboBackStand: JumboBackStand,
        reWinder: ReWinder
    };
    console.log(obj);
}