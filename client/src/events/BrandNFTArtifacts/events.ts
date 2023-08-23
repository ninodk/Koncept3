export const BrandNFTCreatedEvent = {
  inputs: [{ indexed: true, name: "tokenId", type: "uint256" }],
  name: "BrandNFTCreated",
  type: "event",
} as const;
