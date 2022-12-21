/*https://statsapi.web.nhl.com/api/v1/schedule?date=2022-12-19*/

let today = new Date();
let temp = today.toLocaleDateString("zh-Hans-CN");     // 2022/12/19
let tdString = temp.split("/").join("-");        // 2022-12-19
const tdURL = "https://statsapi.web.nhl.com/api/v1/schedule?date="+tdString;
let regFormatTd = today.toLocaleDateString("en-Gb");

let yesterday = new Date();
yesterday.setDate(yesterday.getDate()-1)
let temp2 = yesterday.toLocaleDateString("zh-Hans-CN")
const ydString = temp2.split("/").join("-");
const ydURL = "https://statsapi.web.nhl.com/api/v1/schedule?date="+ydString;
let regFormatYd = yesterday.toLocaleDateString("en-Gb");

//let tempList = document.getElementById("gameTable");
//let dynGameTable = document.getElementById("dynGameTable");
let tdGameTable = document.getElementById("tdGameTable");
let ydGameTable = document.getElementById("ydGameTable");

let todayDate;
let parsedDate;

let todayGameList = [];
let yesterdayGameList = [];
todayGameList = getGameList(tdURL, todayGameList);
yesterdayGameList = getGameList(ydURL, yesterdayGameList);
console.log(todayGameList);
console.log(yesterdayGameList);

//printToList(todayGameList, tdGameTable);
// Tmeout to deal with async
setTimeout(function() {printToList(todayGameList, tdGameTable); }, 300)
document.getElementById("gamesTdText").innerHTML = "Games that start on " + regFormatTd + " (gmt)";

setTimeout(function() {printToList(yesterdayGameList, ydGameTable); }, 300)
document.getElementById("gamesYdText").innerHTML = "Games that started on " + regFormatYd + " (gmt)";

function getGameList(url, gameList) {
    //let templist = [];
    $.getJSON(url, function(data) {
        async: false
        //console.log(data);
        //console.log(data.totalGames);
        let games = JSON.parse(data.totalGames);
        for (let i=0; i<games; i++) {
            let d = JSON.parse(JSON.stringify(data.dates[0].games[i].gameDate));
            let dDate = d.split("T");
            dDate = dDate[1].split("Z");
            dDate = dDate[0].split(":");
            let time = dDate[0] + ":" + dDate[1];
            let date = d.split("T")[0];
    
            let awayId = JSON.parse(data.dates[0].games[i].teams.away.team.id);
            let awayName = JSON.parse(JSON.stringify(data.dates[0].games[i].teams.away.team.name));
            let awayScore = JSON.parse(data.dates[0].games[i].teams.away.score);
    
            let homeId = JSON.parse(data.dates[0].games[i].teams.home.team.id);
            let homeName = JSON.parse(JSON.stringify(data.dates[0].games[i].teams.home.team.name));
            let homeScore = JSON.parse(data.dates[0].games[i].teams.home.score);
    
            let status = JSON.parse(data.dates[0].games[i].status.statusCode);
    
            const game = new Game(date, time, awayId, awayName, awayScore, homeId, homeName, homeScore, status);
            //gameList[i] = game;
            gameList.push(game);
            //templist.push(game);
        }
    });
    //console.log(templist[0]);
    return gameList;
}


function printToList(gameList, table) {
    console.log(gameList[0]);
    console.log(gameList.length);
    gameList.forEach((item) => {
        let row = table.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);

        // Missing 8 = Scheduled (Time TBD),    9 = Postponed
        cell1.innerHTML = item.awayName;
        if (item.status == 3 || item.status == 4) {                             // Game live
            cell2.innerHTML = item.awayScore + " - " + item.homeScore;
            // Color yellow/green?
        } else if (item.status == 5 || item.status == 6 || item.status == 7){   // Game over
            cell2.innerHTML = item.awayScore + " - " + item.homeScore;
            // Color red?
        } else if (item.status == 2) {                                          // Pre-Game
            cell2.innerHTML = "Pre-Game";
            // Color
        } else if (item.status == 1) {                                          // Game Scheduled
            cell2.innerHTML = item.gameTime;
            //table.style.backgroundColor = "color: red";
        }    
        cell3.innerHTML = item.homeName;
    })
}

/*$.getJSON('https://statsapi.web.nhl.com/api/v1/schedule', function(data) {
    async: false
    //console.log(data);
    //console.log(data.totalGames);
    let games = JSON.parse(data.totalGames);
    for (let i=0; i<games; i++) {
        let d = JSON.parse(JSON.stringify(data.dates[0].games[i].gameDate));
        let dDate = d.split("T");
        dDate = dDate[1].split("Z");
        dDate = dDate[0].split(":");
        let time = dDate[0] + ":" + dDate[1];
        let date = d.split("T")[0];

        let awayId = JSON.parse(data.dates[0].games[i].teams.away.team.id);
        let awayName = JSON.parse(JSON.stringify(data.dates[0].games[i].teams.away.team.name));
        let awayScore = JSON.parse(data.dates[0].games[i].teams.away.score);

        let homeId = JSON.parse(data.dates[0].games[i].teams.home.team.id);
        let homeName = JSON.parse(JSON.stringify(data.dates[0].games[i].teams.home.team.name));
        let homeScore = JSON.parse(data.dates[0].games[i].teams.home.score);

        let status = JSON.parse(data.dates[0].games[i].status.statusCode);

        const game = new Game(date, time, awayId, awayName, awayScore, homeId, homeName, homeScore, status);
        gameList[i] = game;
    }
    todayDate = gameList[0].gameDate.split("T");
    todayDate = todayDate[0];
    parsedDate = todayDate.split("-");
    todayDate = parsedDate[2] + "." + parsedDate[1] + "." + parsedDate[0];
    document.getElementById("gamesText").innerHTML = "Games starting on " + todayDate + " (gmt)";

    console.log(gameList);
    gameList.forEach((item) => {
        let row = dynGameTable.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);

        // Missing 8 = Scheduled (Time TBD),    9 = Postponed
        cell1.innerHTML = item.awayName;
        if (item.status == 3 || item.status == 4) {                             // Game live
            cell2.innerHTML = item.awayScore + " - " + item.homeScore;
            // Color yellow/green?
        } else if (item.status == 5 || item.status == 6 || item.status == 7){   // Game over
            cell2.innerHTML = item.awayScore + " - " + item.homeScore;
            // Color red?
        } else if (item.status == 2) {                                          // Pre-Game
            cell2.innerHTML = "Pre-Game";
            // Color
        } else if (item.status == 1) {                                          // Game Scheduled
            cell2.innerHTML = item.gameTime;
            dynGameTable.style.backgroundColor = "color: red";
        }
        
        cell3.innerHTML = item.homeName;
    })
}); */

/*$.getJSON("https://statsapi.web.nhl.com/api/v1/schedule?date=" + ydString, function(dataS) {

}); */


// document.getElementById('box').addEventListener('click', function(){
//     alert('I got clicked');
// });