/* https://statsapi.web.nhl.com/api/v1/standings/byConference */

let sTable = document.getElementById("eastTable");
let wTable = document.getElementById("westTable");

let teamMap = new Map(); 
$.getJSON('https://statsapi.web.nhl.com/api/v1/teams', function(data) {
    //console.log(data);
    //console.log(Object.keys(data.teams).length);
    let teamAmount = Object.keys(data.teams).length;

    for (let i=0; i < teamAmount; i++) {
        let name = JSON.parse(JSON.stringify(data.teams[i].teamName));
        let city = JSON.parse(JSON.stringify(data.teams[i].locationName));
        let abb = JSON.parse(JSON.stringify(data.teams[i].abbreviation));
        let id = JSON.parse(data.teams[i].id);
        let conf = JSON.parse(JSON.stringify(data.teams[i].conference.name));
        let divi = JSON.parse(JSON.stringify(data.teams[i].division.name));

        const team = new Team(name, city, abb, id, conf, divi);
        teamMap.set(id, team);
    }
});

let teamStatsMapEast = new Map();       // records[0]
let teamStatsMapWest = new Map();       // records[1]
$.getJSON('https://statsapi.web.nhl.com/api/v1/standings/byConference', function(sData) {
    console.log(sData);
    let teamRAmount = Object.keys(sData.records[1].teamRecords).length;
    console.log(teamRAmount);

    for(let j=0; j < teamRAmount; j++) {
        let id = JSON.parse(sData.records[0].teamRecords[j].team.id);
        let losses = JSON.parse(sData.records[0].teamRecords[j].leagueRecord.losses);
        let ot = JSON.parse(sData.records[0].teamRecords[j].leagueRecord.ot);
        let wins = JSON.parse(sData.records[0].teamRecords[j].leagueRecord.wins);
        let points = JSON.parse(sData.records[0].teamRecords[j].points);
        let divRank = JSON.parse(sData.records[0].teamRecords[j].divisionRank);
        let confRank = JSON.parse(sData.records[0].teamRecords[j].conferenceRank);
        let leagRank = JSON.parse(sData.records[0].teamRecords[j].leagueRank);
        let gamesPlayed = JSON.parse(sData.records[0].teamRecords[j].gamesPlayed);

        const teamStats = new TeamStats(id, losses, ot, wins, points, divRank, confRank,
             leagRank, gamesPlayed);
        teamStatsMapEast.set(id, teamStats);
    }

    for (let k=0; k < teamRAmount; k++) {
        let id = JSON.parse(sData.records[1].teamRecords[k].team.id);
        let losses = JSON.parse(sData.records[1].teamRecords[k].leagueRecord.losses);
        let ot = JSON.parse(sData.records[1].teamRecords[k].leagueRecord.ot);
        let wins = JSON.parse(sData.records[1].teamRecords[k].leagueRecord.wins);
        let points = JSON.parse(sData.records[1].teamRecords[k].points);
        let divRank = JSON.parse(sData.records[1].teamRecords[k].divisionRank);
        let confRank = JSON.parse(sData.records[1].teamRecords[k].conferenceRank);
        let leagRank = JSON.parse(sData.records[1].teamRecords[k].leagueRank);
        let gamesPlayed = JSON.parse(sData.records[1].teamRecords[k].gamesPlayed);

        const teamStats = new TeamStats(id, losses, ot, wins, points, divRank, confRank,
             leagRank, gamesPlayed);
        teamStatsMapWest.set(id, teamStats);

    }

    let row = sTable.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);

    cell1.innerHTML = "Name";
    cell2.innerHTML = "GP";
    cell3.innerHTML = "W";
    cell4.innerHTML = "L";
    cell5.innerHTML = "OT";
    cell6.innerHTML = "P";

    teamStatsMapEast.forEach((item) => {
        let key = item.id;
        let name = teamMap.get(key).name;

        let row = sTable.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);

        cell1.innerHTML = name;
        cell2.innerHTML = item.gamesPlayed;
        cell3.innerHTML = item.wins;
        cell4.innerHTML = item.losses;
        cell5.innerHTML = item.ot;
        cell6.innerHTML = item.points;
    })



    let wRow = wTable.insertRow(-1);
    let wcell1 = wRow.insertCell(0);
    let wcell2 = wRow.insertCell(1);
    let wcell3 = wRow.insertCell(2);
    let wcell4 = wRow.insertCell(3);
    let wcell5 = wRow.insertCell(4);
    let wcell6 = wRow.insertCell(5);

    wcell1.innerHTML = "Name";
    wcell2.innerHTML = "GP";
    wcell3.innerHTML = "W";
    wcell4.innerHTML = "L";
    wcell5.innerHTML = "OT";
    wcell6.innerHTML = "P";

    teamStatsMapWest.forEach((item) => {
        let key = item.id;
        let name = teamMap.get(key).name;

        let wRow = wTable.insertRow(-1);
        let wcell1 = wRow.insertCell(0);
        let wcell2 = wRow.insertCell(1);
        let wcell3 = wRow.insertCell(2);
        let wcell4 = wRow.insertCell(3);
        let wcell5 = wRow.insertCell(4);
        let wcell6 = wRow.insertCell(5);

        wcell1.innerHTML = name;
        wcell2.innerHTML = item.gamesPlayed;
        wcell3.innerHTML = item.wins;
        wcell4.innerHTML = item.losses;
        wcell5.innerHTML = item.ot;
        wcell6.innerHTML = item.points;
    })

});