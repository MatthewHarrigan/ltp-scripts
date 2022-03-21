import { existsSync, readFileSync } from "fs";

const getEnd = (type) => `-----END ${type}-----`;
const getStart = (type) => `-----BEGIN ${type}-----`;
const removeEmpty = (text) => text && text !== "\n";

const load = (path) => (existsSync(path) ? readFileSync(path, "utf8") : "");

const getBlocks = (path, type) =>
  load(path)
    .split(getEnd(type))
    .map((block) => block.substr(block.indexOf(getStart(type))))
    .filter(removeEmpty)
    .map((block) => `${block}${getEnd(type)}`);

export const loadCA = (path) => getBlocks(path, "CERTIFICATE");
export const loadCertificate = (path) => getBlocks(path, "CERTIFICATE")[0];
export const loadKey = (path) =>
  getBlocks(path, "RSA PRIVATE KEY")[0] || getBlocks(path, "PRIVATE KEY")[0];
