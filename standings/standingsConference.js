/* https://statsapi.web.nhl.com/api/v1/standings/byConference */

let eTable = document.getElementById("eastTable");
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

    for (let i = 0; i < 2; i++) {
        for(let j=0; j < teamRAmount; j++) {
            let id = JSON.parse(sData.records[i].teamRecords[j].team.id);
            let losses = JSON.parse(sData.records[i].teamRecords[j].leagueRecord.losses);
            let ot = JSON.parse(sData.records[i].teamRecords[j].leagueRecord.ot);
            let wins = JSON.parse(sData.records[i].teamRecords[j].leagueRecord.wins);
            let points = JSON.parse(sData.records[i].teamRecords[j].points);
            let divRank = JSON.parse(sData.records[i].teamRecords[j].divisionRank);
            let confRank = JSON.parse(sData.records[i].teamRecords[j].conferenceRank);
            let leagRank = JSON.parse(sData.records[i].teamRecords[j].leagueRank);
            let gamesPlayed = JSON.parse(sData.records[i].teamRecords[j].gamesPlayed);
    
            const teamStats = new TeamStats(id, losses, ot, wins, points, divRank, confRank,
                 leagRank, gamesPlayed);
            
            if (i == 0) {
                teamStatsMapEast.set(id, teamStats);
            } else if (i == 1) {
                teamStatsMapWest.set(id, teamStats);
            }
        }
    }
    addToTable(eTable, teamStatsMapEast);
    addToTable(wTable, teamStatsMapWest);
});

function addToTable(table, tMap) {
    let row = table.insertRow(-1);
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

    tMap.forEach((item) => {
        let key = item.id;
        let name = teamMap.get(key).name;
        //console.log("Key " + key + " name " + name);

        let row = table.insertRow(-1);
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
}