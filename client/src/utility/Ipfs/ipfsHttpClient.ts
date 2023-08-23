import { create as ipfsHttpClient } from "ipfs-http-client";

/* define our IPFS endpoint */
const projectId = process.env.INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET;
const projectIdAndSecret = `${projectId}:${projectSecret}`;
const auth = `Basic ${Buffer.from(projectIdAndSecret).toString("base64")}`;

const ipfsClient = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});
export default ipfsClient;
