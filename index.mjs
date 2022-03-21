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

const getResults = async () => {
  const response = await fetch(
    "https://tipo.api.bbci.co.uk/topic?id=cdd52ryer5yt",
    requestOptions
  );
  const result = await response.json();

  let {
    results: [
      {
        subjectList: [{ subjectId }],
      },
    ],
  } = result;

  let id = subjectId.split("/")[4].split("#")[0];
  console.log(id);

  const thingsResponse = await fetch(
    `https://service-gateway.fabl.api.bbci.co.uk/service/things/path/${id}/query/mixin=geo`,
    requestOptions
  );
  const thingsResult = await thingsResponse.json();

  let {
    result: {
      thing: {
        "geo:long": [long],
        "geo:lat": [lat],
      },
    },
  } = thingsResult;

  console.log(long, lat);
};

getResults();
