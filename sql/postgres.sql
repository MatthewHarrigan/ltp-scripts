DROP TABLE IF EXISTS local_news_topics;

CREATE TABLE local_news_topics (
	topicId VARCHAR(50) PRIMARY KEY NOT NULL,
    summaries INTEGER,
	long VARCHAR(50),
	lat VARCHAR(50),
	sensorLocation GEOMETRY
);

CREATE INDEX topics_geom_idx
  ON local_news_topics
  USING GIST (geography(sensorLocation));


-- INSERT INTO local_news_topics (topicId, long, lat, sensorLocation) 
-- VALUES ('F040520 BJI910J', -2.183,57.367, ST_GeomFromText('POINT(-2.183 57.367)',4326));


-- SELECT * FROM local_news_topics;


