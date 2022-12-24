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
let goalsTable = document.getElementById("goalsTableId");
let assistsTable = document.getElementById("assistsTableId");

let goalieStatsArray = [];
let goalsAgainsAVGTable = document.getElementById("GoalsAgainstAVG");

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
setTimeout(function() {sortListPoints(playerStatsArray, pointsTable); }, 2000)
setTimeout(function() {sortListPoints(playerStatsArray, goalsTable); }, 2000)
setTimeout(function() {sortListAssists(playerStatsArray, assistsTable); }, 2000)
setTimeout(function() {sortListGoalsAgainstAVG(goalieStatsArray, goalsAgainsAVGTable); }, 2000)

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
                let name = JSON.parse(JSON.stringify(rData.teams[i].roster.roster[j].person.fullName));
                let teamId = JSON.parse(JSON.stringify(rData.teams[i].id));
                let id = JSON.parse(JSON.stringify(rData.teams[i].roster.roster[j].person.id));
                let link = JSON.parse(JSON.stringify(rData.teams[i].roster.roster[j].person.link));
                  // https://statsapi.web.nhl.com/api/v1/people/8475784/stats?stats=statsSingleSeason&season=20222023
                    let statURL = "https://statsapi.web.nhl.com" + link + "/stats?stats=statsSingleSeason&season=20222023";
                    $.getJSON(statURL, function(sData) {
                        if (sData.stats[0].splits.length !== 0) {
                            if (pos === "G") {
                                    let gamesPlayed = JSON.parse(sData.stats[0].splits[0].stat.games);

                                    if (gamesPlayed >= 10) {
                                        let shutouts = JSON.parse(sData.stats[0].splits[0].stat.shutouts);
                                        let savePercentage = JSON.parse(sData.stats[0].splits[0].stat.savePercentage);
                                        let goalsAgainsAVG = JSON.parse(sData.stats[0].splits[0].stat.goalAgainstAverage);
                                        let goalieStat = new GoalieStats(name, teamId, id, link, pos, shutouts, savePercentage, goalsAgainsAVG, gamesPlayed);
                                        goalieStatsArray.push(goalieStat);
                                    }
                            } else {
                                    let assists = JSON.parse(sData.stats[0].splits[0].stat.assists);
                                    let goals = JSON.parse(sData.stats[0].splits[0].stat.goals);
                                    let games = JSON.parse(sData.stats[0].splits[0].stat.games);
                                    let points = JSON.parse(sData.stats[0].splits[0].stat.points);
                            
                                    let playerStat = new PlayerStats(name, teamId, id, link, pos, assists, goals, games, points);
            
                                    playerStatsArray.push(playerStat);
                            }
                        }
                    });
                }
        }
        let endTime = performance.now();
        let perfTime = endTime-startTime;
        console.log("Took " + perfTime + " ms");
    });
}

function sortListPoints(list, pTable) {
    list.sort(function(a,b) {
        if (a.points < b.points)
            return 1;
        if (a.points > b.points)
            return -1;
        return 0;
    });
    console.log(list);
    addToTable(list, pTable);
}

function sortListGoals(list, table) {
    list.sort(function(a,b) {
        if (a.goals < b.goals)
            return 1;
        if (a.goals > b.goals)
            return -1;
        return 0;
    });
    console.log(list);
    addToTable(list, table);
}

function sortListAssists(list, table) {
    list.sort(function(a,b) {
        if (a.assists < b.assists)
            return 1;
        if (a.assists > b.assists)
            return -1;
        return 0;
    });
    console.log(list);
    addToTable(list, table);
}

function sortListGoalsAgainstAVG(list, table) {
    list.sort(function(a,b) {
        if (a.goalsAgainsAVG < b.goalsAgainsAVG)
            return -1;
        if (a.goalsAgainsAVG > b.goalsAgainsAVG)
            return 1;
        return 0;
    });
    console.log(list);
    addToGoalieTable(list, table);
    
}

function addToGoalieTable(list, table) {
    const topList = list.slice(0, 10);

    let k = 1;
    topList.forEach((item) => {
        let name = item.name;
        let goalsAgainsAVG = item.goalsAgainsAVG;
        let games = item.gamesPlayed;

        let names = name.split(" ");
        names = names[0] + "\n" + names[1];

        let row = table.insertRow(-1);
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let cell3 = row.insertCell(3);

        cell0.innerHTML = k;
        cell1.innerHTML = names;
        cell2.innerHTML = games;
        cell3.innerHTML = goalsAgainsAVG;
        k = k +1;

    })
}

function addToTable(list, table) {
    const topList = list.slice(0, 10);

    let k = 1;
    topList.forEach((item) => {
        let name = item.name;
        let assists = item.assists;
        let goals = item.goals;
        let points = item.points;

        let names = name.split(" ");
        names = names[0] + "\n" + names[1];

        let row = table.insertRow(-1);
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let cell3 = row.insertCell(3);
        let cell4 = row.insertCell(4);

        cell0.innerHTML = k;
        cell1.innerHTML = names;
        cell2.innerHTML = goals;
        cell3.innerHTML = assists;
        cell4.innerHTML = points;
        k = k +1;
    })
}

