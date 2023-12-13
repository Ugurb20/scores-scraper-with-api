package models

type Match struct {
    ID            string `json:"id" db:"id"`
    HomeTeamName  string `json:"homeTeamName" db:"home_team_name"`
    AwayTeamName  string `json:"awayTeamName" db:"away_team_name"`
    HomeTeamScore int    `json:"homeTeamScore" db:"home_team_score"`
    AwayTeamScore int    `json:"awayTeamScore" db:"away_team_score"`
    Status        string `json:"status" db:"status"`
    MatchStartUtc string  `json:"matchStartUtc" db:"match_start_utc"`
	MatchDate string  `json:"matchDate" db:"match_date"`
    UpdatedAt     string `json:"updatedAt" db:"updated_at"`

}
