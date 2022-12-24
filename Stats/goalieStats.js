class GoalieStats extends Player {
    constructor(name, teamId, id, link, pos, shutouts, savePercentage, goalsAgainsAVG, gamesPlayed) {
        super(name, teamId, id, link, pos);

        this.shutouts = shutouts;
        this.savePercentage = savePercentage;
        this.goalsAgainsAVG = goalsAgainsAVG;
        this.gamesPlayed = gamesPlayed;
    }
}