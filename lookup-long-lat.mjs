import ProgressBar from "progress";

import fetch from "node-fetch";

import { newAgent } from "./httpClient/agents.mjs";

const requestOptions = {
  agent: newAgent("https", {
    ca: "/etc/pki/tls/certs/ca-bundle.crt",
    cert: "/etc/pki/tls/certs/client.crt",
    key: "/etc/pki/tls/private/client.key",
  }),
  method: "GET",
};

import { appendFile, access, readFile, unlink } from "fs/promises";

const outFileName = "./out/out.csv";

const file = await readFile("./in/ltp-topics.csv", "utf-8");
const lines = file.split("\r\n");

const headings = lines.splice(0, 1);

const append = true;

try {
    if (append) {

        const oFile = await readFile(outFileName, "utf-8");
        if (oFile) {
          const oLines = oFile.split("\n");
          const lastTopicId = oLines[oLines.length - 2].split(",")[0];
          const startsWithN = lines.findIndex((line) => line.startsWith(lastTopicId));
          lines.splice(0, startsWithN + 1);
        }
      
      } else {
          await readFile(outFileName, "utf-8");
          await unlink(outFileName);
      }
      
} catch (e) {

}

const out = [];

var bar = new ProgressBar(":bar", { total: lines.length });

for (const line of lines) {
  bar.tick();

  const [topicId, topicName, visibility, summaries] = line.split(",");

  try {
    const response = await fetch(
      `https://tipo.api.bbci.co.uk/topic?id=${topicId}`,
      requestOptions
    );

    if (response.status !== 200) {
      throw (topicId, response.status);
    }

    const {
      results: [
        {
          subjectList: [{ subjectId }],
        },
      ],
    } = await response.json();

    const [thingsId] = subjectId.split("/")[4].split("#");

    const thingsResponse = await fetch(
      `https://service-gateway.fabl.api.bbci.co.uk/service/things/path/${thingsId}/query/mixin=geo`,
      requestOptions
    );

    if (thingsResponse.status !== 200) {
      throw (topicId, thingsId, thingsResponse.status);
    }

    const {
      result: {
        thing: {
          "geo:long": [long],
          "geo:lat": [lat],
        },
      },
    } = await thingsResponse.json();

    const outLine = [
      topicId,
      topicName,
      visibility,
      summaries,
      thingsId,
      long,
      lat,
    ];

    if (
      !topicId ||
      !topicName ||
      !visibility ||
      !summaries ||
      !thingsId ||
      !long ||
      !lat
    ) {
      throw (
        ("missing fiels",
        topicId,
        topicName,
        visibility,
        summaries,
        thingsId,
        long,
        lat)
      );
    }

    out.push(outLine);

    await appendFile(outFileName, `${outLine.join(",")}\n`);
  } catch (e) {
    console.log(e);
  }
}
