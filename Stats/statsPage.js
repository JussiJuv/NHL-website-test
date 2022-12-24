// Roster for a team (ID)
// https://statsapi.web.nhl.com/api/v1/teams/1?expand=team.roster

// Teams
// https://statsapi.web.nhl.com/api/v1/teams

// Look up teams, create teamList with team objects
// Look up roster per team, then look up player stats for every player
// Create list with player objects

// Jeff Skinner
// https://statsapi.web.nhl.com/api/v1/people/8475784/stats?stats=statsSingleSeason&season=20222023

// Getting all teams
let teamMap = new Map();
let playerStatsArray = [];
let pointsTable = document.getElementById("pointsTableId");

$.getJSON('https://statsapi.web.nhl.com/api/v1/teams', function(data) {
    let teamAmount = Object.keys(data.teams).length;
    console.log(data);

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

setTimeout(function() {getRoster(teamMap); }, 500)
setTimeout(function() {sortList(playerStatsArray, pointsTable); }, 2000)

function getRoster(tMap) {
    let startTime = performance.now();

    console.log("IN");
    let rosterURL = "https://statsapi.web.nhl.com/api/v1/teams/?expand=team.roster";

    $.getJSON(rosterURL, function(rData) {
        console.log(rData);
        let teamAmount = rData.teams.length;

        for (let i = 0; i < teamAmount; i++) {
            let rosterAmount = rData.teams[i].roster.roster.length;
            for (let j = 0; j < rosterAmount; j++) {
                let pos = JSON.parse(JSON.stringify(rData.teams[i].roster.roster[j].position.code));
                if (pos !== "G") {
                    let name = JSON.parse(JSON.stringify(rData.teams[i].roster.roster[j].person.fullName));
                    let teamId = JSON.parse(JSON.stringify(rData.teams[i].id));
                    let id = JSON.parse(JSON.stringify(rData.teams[i].roster.roster[j].person.id));
                    let link = JSON.parse(JSON.stringify(rData.teams[i].roster.roster[j].person.link));
                  // https://statsapi.web.nhl.com/api/v1/people/8475784/stats?stats=statsSingleSeason&season=20222023
                    let statURL = "https://statsapi.web.nhl.com" + link + "/stats?stats=statsSingleSeason&season=20222023";
                    $.getJSON(statURL, function(sData) {

                        if (sData.stats[0].splits.length !== 0) {
                            let assists = JSON.parse(sData.stats[0].splits[0].stat.assists);
                            let goals = JSON.parse(sData.stats[0].splits[0].stat.goals);
                            let games = JSON.parse(sData.stats[0].splits[0].stat.games);
                            let points = JSON.parse(sData.stats[0].splits[0].stat.points);
                    
                            let playerStat = new PlayerStats(name, teamId, id, link, pos, assists, goals, games, points);
    
                            playerStatsArray.push(playerStat);
                        }
                    });
                }
            }
        }
        let endTime = performance.now();
        let perfTime = endTime-startTime;
        console.log("Took " + perfTime + " ms");
    });
}

function sortList(list, table) {
    list.sort(function(a,b) {
        if (a.points < b.points)
            return 1;
        if (a.points > b.points)
            return -1;
        return 0;
    });
    console.log(list);
    addToTable(list, table);
}

function addToTable(list, table) {
    const topList = list.slice(0, 10);

    let row = table.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);

    cell1.innerHTML = "Name";
    cell2.innerHTML = "Goals";
    cell3.innerHTML = "Assists";
    cell4.innerHTML = "Points";

    topList.forEach((item) => {
        let name = item.name;
        let assists = item.assists;
        let goals = item.goals;
        let points = item.points;

        let row = table.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);

        cell1.innerHTML = name;
        cell2.innerHTML = goals;
        cell3.innerHTML = assists;
        cell4.innerHTML = points;
    })

}

