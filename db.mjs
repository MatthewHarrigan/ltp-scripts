import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "myDB",
  password: "root",
  port: 5432,
});

const query = (text, params) => pool.query(text, params);

import { readFile } from "fs/promises";

const dropDB = `DROP TABLE IF EXISTS local_news_topics;

CREATE TABLE local_news_topics (
	topicId VARCHAR(50) PRIMARY KEY NOT NULL,
  topicName VARCHAR(255),
  summaries INTEGER,
	long VARCHAR(50),
	lat VARCHAR(50),
	sensorLocation GEOMETRY
);

CREATE INDEX topics_geom_idx
  ON local_news_topics
  USING GIST (geography(sensorLocation));`;

await query(dropDB);

const file = await readFile("./out/out.csv", "utf-8");

const lines = file.split("\n");

for (const line of lines) {
  if (line === "") {
    break;
  }

  const elements = line.split(",");

  let [topicId, topicName, visibility, summaries, thingId, long, lat] =
    elements;
    
  const q = `INSERT INTO local_news_topics (topicId, topicName, summaries, long, lat, sensorLocation) VALUES ('${topicId}', '${topicName.split("'")[0]}', '${parseInt(
    summaries
  ) || 0}', ${long}, ${lat}, ST_GeomFromText('POINT(${long} ${lat})',4326))`;
  console.log(q);
  await query(q);
}
