export enum PlayType {
  NBA,
  NFL,
}

export enum ActiveStatus {
  Actived = 1,
  Inactived = -1,
  Canceled = 0,
}

export enum Difficulty {
  None,
  Easy,
  Medium,
  Hard,
}

// Column order MUST match the MySQL table
export const NBA_COLUMNS = [
  "id",
  "firstName",
  "lastName",
  "position",
  "height",
  "weight",
  "jerseyNumber",
  "college",
  "country",
  "draftYear",
  "draftRound",
  "draftNumber",
  "teamId",
  "status",
  "active",
  "difficulty",
  "imageLink",
]

// Column order MUST match the MySQL table
export const NFL_COLUMNS = [
  "id",
  "firstName",
  "lastName",
  "position",
  "positionAbbreviation",
  "height",
  "weight",
  "jerseyNumber",
  "college",
  "experience",
  "age",
  "teamId",
  "status",
  "active",
  "difficulty",
  "imageLink",
]
