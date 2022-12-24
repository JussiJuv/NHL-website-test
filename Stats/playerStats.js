class PlayerStats extends Player {
    constructor(name, teamId, id, link, pos, assists, goals, games, points) {
        super(name, teamId, id, link, pos);

        this.assists = assists;
        this.goals = goals;
        this.games = games;
        this.points = points;
    }
}
