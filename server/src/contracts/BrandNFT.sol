// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Brand NFT Smart Contract
 * @author Nino De Kerpel
 * @notice Smart Contract for creating a Non-Fungible Token (NFT)
 * @dev A smart contract for creating and minting non-fungible tokens (NFTs).
 */
contract BrandNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  // _tokenIds allows us to keep up with an incrementing value for a unique identifier for each token
  Counters.Counter private _tokenIds;
  /**
   * @notice Address of the Brand Market that we want to allow the NFT to interact with and vice versa
   * @dev We want to be able to give the brandmarket the ability to transact these tokens or change the ownership of the tokens from a seperate contract
   */
  address contractAddress;

  /**
   * @dev Initializes the contract with the provided brand address as a parameter.
   * The contract name is set as "Koncept Brand Tokens" with the symbol "KBT".
   * @param marketAddress The address of the brand associated with the NFTs.
   */
  constructor(address marketAddress) ERC721("Koncept Brand NFT", "KBN"){
    contractAddress = marketAddress;
  }
  /**
   * @notice Creates a NFT
   * @dev Creates and mints a new NFT with a given tokenURI.
   * The brand contract address and tokenId has already been stored within this contract.
   * The person invoking this is also known because it's a transaction.
   * @param tokenURI The token URI for the NFT's metadata.
   * @return The ID of the minted NFT. Makes interaction with the Smart Contract from the client application possible
   */
  function createToken(string memory tokenURI) public returns (uint){
    _tokenIds.increment(); // incrementing the value (starting at 0)
    uint256 newItemId = _tokenIds.current();

    /**
     * @notice Minting the token
     * @dev Minting the token with the sender and tokenURI
     * @param msg.sender is the creator of the token
     * @param newItemId is the unique identifier of the new token minted
     */
    _mint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);
    /**
     * @notice 
     * @dev Giving the brand the approval to transact this token between users from within another contract. Else we couldn't do this from another contract
     * @param contractAddress is the address of this contract
     * @param true gives the permission to transact this token between users from within another contract
     */
    setApprovalForAll(contractAddress, true);
    
  }

}