import http from "http";
import https from "https";

import { loadCA, loadCertificate, loadKey } from "./ssl.mjs";

const defaultCAs = [
  // '/etc/pki/cloud-ca.pem',
  // '/etc/pki/cosmos/current/client.crt',
  // '/etc/pki/tls/certs/ca-bundle.crt',
];

const protocols = {
  http,
  https,
};

export const newAgent = (type, certs = {}) => {
  const { ca, cert, key } = certs;
  const sslOptions = certs
    ? {
        ca: [ca, ...defaultCAs].map(loadCA).reduce((a, b) => {
          a.push(...b);
          return a;
        }, []),
        cert: loadCertificate(cert),
        key: loadKey(key),
      }
    : {};

  const agentOptions = {
    ...sslOptions
    // ,
    // keepAlive: true,
    // keepAliveMsecs: 30000, // https://github.com/node-fetch/node-fetch/issues/1295
  };

  return new protocols[type].Agent(agentOptions);
};
