import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  NftContractAddress,
  ownerAddress,
  storeContractAddress,
} from "../../../../server/src/configurations/config";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import ipfsClient from "../../utility/Ipfs/ipfsHttpClient";
import {
  BaseError,
  ContractFunctionRevertedError,
  createWalletClient,
  custom,
} from "viem";
import { parseUnits } from "viem";
import { polygonMumbai } from "viem/chains";
import publicClient from "../../utility/viem/client";
// ABIs
import BrandNFTArtifact from "../../../../server/src/artifacts/contracts/BrandNFT.sol/BrandNFT.json";
import BrandStoreArtifact from "../../../../server/src/artifacts/contracts/BrandStore.sol/BrandStore.json";
// Smart Contract Events
import { BrandNFTCreatedEvent } from "../../events/BrandNFTArtifacts/events";

const CreateNFT: React.FC = () => {
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  });
  /* configure initial state to be used in the component */
  const [nft, setNFT] = useState({
    name: "",
    description: "",
    price: 0,
  });
  const [tokenId, setTokenId] = useState<BigInt>();
  const [tokenAdded, setTokenAdded] = useState(false);
  // Will be used as a cover image
  const [image, setImage] = useState(null);

  const [loaded, setLoaded] = useState(false);

  const fileRef = useRef(null);
  const { name, price, description } = nft;
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      /* Delay rendering buttons until dynamic import is complete */
      setLoaded(true);
    }, 500);
  }, []);

  const unwatch = publicClient.watchEvent({
    address: NftContractAddress,
    event: BrandNFTCreatedEvent,
    onLogs: (logs) => createBrandItem(logs[0].args.tokenId),
  });

  /* Starting the minting process of the NFT */
  const mintNFT = async () => {
    if (!name || !price || !description) return;
    const hash = await uploadNftToIpfs();
    await createToken(hash);
    router.push(`/collections/`);
  };

  /* Save function to upload Token metadata to IPFS */
  const uploadNftToIpfs = async () => {
    // 1. Takes the content we have in our local state and turn it into JSON
    try {
      // 2. Upload to IPFS
      const added = await ipfsClient.add(JSON.stringify(nft));
      return added.path;
    } catch (err) {
      console.log("error uploading NFT: ", err);
    }
  };

  /* Talking to our Brand NFT Smart Contract and anchoring the token to our contract */
  const createToken = async (hash: string) => {
    // option 1 - using Viem (alternative for Ethers library)
    if (account && account.isConnected && account.address === ownerAddress) {
      const walletClient = createWalletClient({
        account: account.address,
        chain: polygonMumbai,
        transport: custom(window.ethereum),
      });

      try {
        const { request } = await publicClient.simulateContract({
          address: NftContractAddress,
          abi: BrandNFTArtifact.abi,
          functionName: "createToken",
          args: [hash],
          account: account.address,
          chain: polygonMumbai,
        });
        console.log("request create token: ", request);

        const txHash = await walletClient.writeContract(request);
        console.log(`transaction hash of NFT mint: ${txHash}`);

        const confirmations = await publicClient.getTransactionConfirmations({
          hash: txHash,
        });

        if (confirmations.toString() != "0") {
          setTokenAdded(true);
          return;
        }
      } catch (err) {
        if (err instanceof BaseError) {
          const revertError = err.walk(
            (err) => err instanceof ContractFunctionRevertedError
          );
          if (revertError instanceof ContractFunctionRevertedError) {
            const errorName = revertError.data?.errorName ?? "";
            console.log(errorName);
          }
        }
      }
    }
  };

  const createBrandItem = async (tokenId?: BigInt) => {
    if (account && account.isConnected && account.address === ownerAddress) {
      const walletClient = createWalletClient({
        account: account.address,
        chain: polygonMumbai,
        transport: custom(window.ethereum),
      });
      // Parsing the set price to wei
      const price = parseUnits(`${nft.price}`, 18);
      try {
        const data = await publicClient.readContract({
          address: storeContractAddress,
          abi: BrandStoreArtifact.abi,
          functionName: "getListingPrice",
        });

        const { request } = await publicClient.simulateContract({
          address: storeContractAddress,
          abi: BrandStoreArtifact.abi,
          functionName: "createBrandItem",
          args: [NftContractAddress, tokenId, price],
          value: data,
          account: account.address,
          chain: polygonMumbai,
        });
        console.log("request create brand item: ", request);

        // optional - wait for the transaction to be confirmed before rerouting
        const txHash = await walletClient.writeContract(request);
        console.log(`transaction hash of created brand item : ${txHash}`);
      } catch (err) {
        if (err instanceof BaseError) {
          const revertError = err.walk(
            (err) => err instanceof ContractFunctionRevertedError
          );
          if (revertError instanceof ContractFunctionRevertedError) {
            const errorName = revertError.data?.errorName ?? "";
            console.log(errorName);
          }
        }
      }
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    /* Upload NFT image to IPFS and save hash to state */
    // 1. Getting the file uploaded of the event
    const uploadedFile = e.target.files[0];
    // Checking if the file exisits, if it does not then cancel it
    if (!uploadedFile) return;

    try {
      // 2. it exists, so uploading to IPFS...
      const added = await ipfsClient.add(uploadedFile, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      // added path is the path that gets returned after the upload
      ipfsClient.pin.add(added.path).then((res) => {
        console.log(`result: ${res}`);
        console.log(`added path: ${added.path}`);
        // update current state with existing state
        // '...state' will be the NFT name, description and price
        setNFT((state) => ({ ...state, image: added.path }));

        // Set the image locally to render it and see what it looks like
        setImage(uploadedFile);
      });
    } catch (e) {
      console.log("Error uploading files: ", e);
    }
  };
  return (
    <>
      {account.isConnected && account.address === ownerAddress ? (
        <div className="w-10/12 h-screen">
          <div className="grid grid-flow-row grid-cols-2 mt-5 auto-rows-max gap-x-4 gap-y-8">
            <div className="text-4xl font-semibold leading-7 text-slate-800">
              Create a NFT
            </div>
            <div className="col-start-1">
              <label
                htmlFor="image"
                className="block pb-4 text-xl font-medium leading-6 text-slate-700"
              >
                Upload an Image, Video, Audio or 3D model
              </label>
              <div className="flex justify-center px-6 py-10 mt-2 border-2 border-dotted border-slate-700 rounded-xl">
                <div className="text-center">
                  <div className="flex justify-center mt-4 text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative font-semibold bg-white rounded-md cursor-pointer text-primary focus-within:outline-none focus-within:ring-0 focus-within:ring-slate-700 focus-within:ring-offset-2 hover:text-slate-700"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        ref={fileRef}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col h-full col-start-2 row-span-4">
              <span className="block pb-4 text-xl font-medium leading-6 text-slate-700">
                Preview
              </span>
              <div className="flex items-center justify-center h-full p-2 mt-2 border-2 border-dotted border-slate-700 rounded-xl">
                {image ? (
                  <img
                    className="w-full h-full"
                    src={URL.createObjectURL(image)}
                  />
                ) : (
                  <div className="relative block">
                    <span className="text-xl font-normal leading-6 text-slate-700">
                      Upload files to see a preview
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="col-start-1">
              <label
                htmlFor="name"
                className="block pb-4 text-xl font-medium leading-6 text-slate-700"
              >
                Name
              </label>
              <div className="flex rounded-md shadow-sm ring-2 ring-inset ring-slate-500 focus-within:ring-2 focus-visible:outline-none focus-within:ring-inset focus-within:ring-primary sm:max-w-full">
                <input
                  name="name"
                  id="name"
                  autoComplete="name"
                  value={nft.name}
                  className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-slate-700 focus-visible:outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Koncept Kitten #3"
                  onChange={(e) => setNFT({ ...nft, name: e.target.value })}
                />
              </div>
            </div>
            <div className="col-start-1 row-start-4">
              <label
                htmlFor="description"
                className="block w-full pb-4 text-xl font-medium leading-6 text-slate-700"
              >
                Description
              </label>
              <div>
                <textarea
                  value={nft.description}
                  name="description"
                  id="description"
                  rows={4}
                  autoComplete="description"
                  className="block w-full rounded-md border-0 py-1.5 px-3 focus-visible:outline-none text-slate-700 shadow-sm ring-2 ring-inset ring-slate-500 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  placeholder="A Kitten That is Just A Koncept"
                  onChange={(e) =>
                    setNFT({ ...nft, description: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-row space-x-4">
              <div className="w-1/2 col-start-1">
                <label
                  htmlFor="price"
                  className="block pb-4 text-xl font-medium leading-6 text-slate-700"
                >
                  Price
                </label>
                <div className="flex rounded-md shadow-sm ring-2 ring-inset ring-slate-500 focus-visible:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary sm:max-w-full">
                  <input
                    value={nft.price}
                    type="text"
                    name="price"
                    id="price"
                    autoComplete="price"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-slate-700 focus-visible:outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="0.01"
                    onChange={(e) => setNFT({ ...nft, price: e.target.value })}
                  />
                  <span className="flex items-center pr-3 text-gray-500 select-none sm:text-sm">
                    MATIC
                  </span>
                </div>
              </div>
              <div className="w-1/2 col-start-1 row-start-5">
                <label
                  htmlFor="supply"
                  className="block pb-4 text-xl font-medium leading-6 text-slate-700"
                >
                  Supply
                </label>
                <div className="flex rounded-md shadow-sm ring-2 ring-inset focus-visible:outline-none ring-slate-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary sm:max-w-full">
                  <input
                    type="text"
                    name="supply"
                    id="supply"
                    autoComplete="supply"
                    value={1}
                    disabled
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-slate-700 focus-visible:outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end mt-6 gap-x-6">
            {loaded && (
              <>
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={mintNFT}
                  type="submit"
                  className="px-3 py-2 text-sm font-semibold text-white rounded-full shadow-sm bg-primary hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Create
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div>Sorry, only accessible by contract owner. </div>
      )}
    </>
  );
};
export default CreateNFT;
