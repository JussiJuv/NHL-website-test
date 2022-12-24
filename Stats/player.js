class Player {
    constructor(name, teamId, id, link, pos) {
        this.name = name;
        this.teamId = teamId;
        this.id = id;
        this.link = link;
        this.pos = pos;
    }
}

// URL for player stats (1 player)
// https://statsapi.web.nhl.com/api/v1/people/8475784/stats?stats=statsSingleSeason&season=20162017