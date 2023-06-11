// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
/** 
 * ReentrancyGuard is a security mechanismgives
 *  Gives us the non reentrant utility 
 *  Allows us to protect certain transactions that are talking to a seperate contract 
 *  Prevents someone hitting this with multiple requests and transactions
 *  Prevents shady things and reentry attacks
 *  Use on functions that talk to a seperate contract
 * */
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Brand Store Smart Contract
 * @author Nino De Kerpel
 * @notice A Smart Contract for managing the digital store of the brand.
 * @dev A Smart Contract for buying,selling and fetching brand items in its digital store.
 */
contract BrandStore is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds; // unique identifier for each brand item that gets created
  Counters.Counter private _itemsSold; // to keep track of the number of items sold (solidity does not allow dynamic length arrays)

  /**
   * @notice Brand owner of the contract
   * @dev We want to be able to determine who is the brand owner of this contract because they're making a comission on every item sold
   */
  address payable brandOwner;
  /**
   * @notice Commission rate when listing an item. The brand owner of this contract earns from this.
   * @dev listingPrice indicates the percentage of the vallue of the token that gets deployed to the network
   * ether indicates 18 decimal points
   */
  uint256 listingPrice = 0.025 ether; // equal to 0.0250000000000000

  /**
   * @notice Contract constructor for deployment
   * @dev Deploying the contract with the address of this contract
   * The owner of this contract is the brand deploying it
   */
  constructor() {
    brandOwner = payable(msg.sender);
  }
  
  /**
   * @notice A struct is an object that has properties and defines the shape of a Brand Item.
   * @dev Creating a Brand Contest Object / Map
   */
  struct BrandItem {
    uint itemId;
    address brandNFTContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }
  // Mapping over brand items to keep up with all the items that have been created
  //  In order to fetch a brand item we need to know and pass its unique identifier
  mapping(uint256 => BrandItem) private idToBrandItem;

  /**
   * @notice An Event for when a brand item gets created
   * @dev This event gets triggered when a brand item gets created and can be used in the client application
   * @param itemId The unique identifier of the brand item.
   * @param brandNFTContract The contract address of the brand NFT. 
   * @param tokenId The unique identifier of the brand token.
   * @param seller The address of the seller of the brand item.
   * @param owner The address of the owner of the brand item.
   * @param price The price of the brand item in ether.
   * @param sold A boolean indicates true/false wether the brand item has been sold.
   */
  event BrandItemCreated (
    uint indexed itemId,
    address indexed brandNFTContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  /**
   * @notice Function to return the listing price (commission rate of the platform)
   * @dev Function to return the listing price. 
   * When want to access this in the client application when this contract gets deployed. 
   * Avoids hardcoding this in our frontend
   */
  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

  /**
   * @notice Creates and sets a brand item up for sale.
   * @dev Creates and sets a brand item up for sale.
   * Using the nonReentrant modifier 
   * Contract owner earns on listing commission (brand owner)
   * @param brandNFTContract contract address of the deployed BrandNFT.sol Smart Contract
   * @param tokenId unique identifier of the token from that contract
   * @param price price of the token
   */
  function createBrandItem(
    address brandNFTContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant{
    // Conditions
    require(price > 0, "Price must be at least 1 wei"); // 1 wei is the very bottom of 18 decimals (0.000000000000000001)
    //  To create a brand item you need to send in some payment to pay for the listing transaction.
    require(msg.value == listingPrice, "Price must be equal to listing price");

    // itemId is the unique identifier of the brand item that goes for salle
    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    // Creating and set the mapping for the BrandItem
    idToBrandItem[itemId] = BrandItem(
      itemId,
      brandNFTContract,
      tokenId,
      payable(msg.sender), // available in the transaction
      payable(address(0)), // owner is set to an empty address because the seller is setting it for sale and no one owns it
      price,
      false // sold is by default false
    );
    
    // Transfering the ownership of the NFT to this contract
    //  The person who is sending this transactionn owns this NFT and we want to transfer the ownership to this contract
    //  This contract is going to transfer the ownership to the next buyer
    IERC721(brandNFTContract).transferFrom(msg.sender, address(this), tokenId);

    /**
     * @dev Firing of the event that can be picked up by the client application
     */
    emit BrandItemCreated(
      itemId, 
      brandNFTContract, 
      tokenId, 
      msg.sender, 
      address(0), 
      price, 
      false
      );
  }

  /**
   * 
   * @param brandNFTContract contract address of the deployed BrandNFT.sol Smart Contract
   * @param itemId unique identifier of the brand item being created and put for sale
   */
  function createMarketSale(address brandNFTContract, uint256 itemId) public payable nonReentrant {
    uint price = idToBrandItem[itemId].price;
    uint tokenId = idToBrandItem[itemId].tokenId; // itemId will not always mach with the tokenId
    
    // Conditions
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");

    // Transfer the value of the transaction to the seller
    idToBrandItem[itemId].seller.transfer(msg.value);
    
    // Transfer the ownership of this token from the contract (brand owner) address to the msg.sender (buyer)
    IERC721(brandNFTContract).transferFrom(address(this), msg.sender, tokenId);

    // Set the local value for the owner to the msg.sender
    idToBrandItem[itemId].owner = payable(msg.sender);
    idToBrandItem[itemId].sold = true;
    _itemsSold.increment();

    // Pay the brand owner of the contract by transferring the listingPrice to the contract owner (in this case the brand)
    payable(brandOwner).transfer(listingPrice);
  }

  /**
   * @notice Returning all the unsold brand items
   * @dev Function that returns all the unsold brand items
   * Public access - accessable from the client application
   * View indicates we are not doing any transaction stuff
   * @return items an array of BrandItems
   */
  function fetchBrandItems() public view returns (BrandItem[] memory){
    uint itemCount = _itemIds.current(); // total number of items currently created
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0; // local value to loop over the created items. Incrementing the value when we have an empty address, which indicates an unsold item

    BrandItem[] memory items = new BrandItem[](unsoldItemCount);
    for(uint i = 0; i < itemCount; i++){
      if(idToBrandItem[i + 1].owner == address(0)){
        uint currentId = idToBrandItem[i + 1].itemId;
        BrandItem storage currentItem = idToBrandItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /**
   * @notice Returninng the items that a user has purchased
   * @dev
   * @return items an array of BrandItems purchased by the user
   */
  function fetchMyNFTs() public view returns (BrandItem[] memory){
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for(uint i = 0; i < totalItemCount; i++){
      // Condition: if the owner address of the brand item is equal to the one who is sending the transaction
      if(idToBrandItem[i+1].owner == msg.sender){
        // By incrementing we set the length for the array that hold the items itself
        itemCount += 1; // We increment the itemCount by 1.
      }
    }
    // Creating a new array of brand items with a length based on the number of items the sender holds (itemCount)
    BrandItem[] memory items = new BrandItem[](itemCount);
    for(uint i = 0; i < totalItemCount; i++){
      if(idToBrandItem[i+1].owner == msg.sender){
        uint currentId = idToBrandItem[i + 1].itemId;
        BrandItem storage currentItem = idToBrandItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /**
   * @notice Returns only the items that a user have created
   * @dev Function that returns only the items that a user have created.
   * Public access - accessable from the client application
   * View indicates we are not doing any transaction stuff
   * @return items an array of BrandItems created by the user
   */
  function fetchBrandItemsCreated() public view returns (BrandItem[] memory){
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for(uint i = 0; i < totalItemCount; i++){
      // Condition: if the seller address of the brand item is equall to the one who is sending the transaction
      if(idToBrandItem[i+1].seller == msg.sender){
        // By incrementing we set the length for the array that hold the items itself
        itemCount += 1; // We increment the itemCount by 1.
      }
    }

    // Creating a new array of brand items with a length based on the number of items the sender created (itemCount)
    BrandItem[] memory items = new BrandItem[](itemCount);
    for(uint i = 0; i < totalItemCount; i++){
      if(idToBrandItem[i+1].seller == msg.sender){
        uint currentId = idToBrandItem[i+1].itemId;
        BrandItem storage currentItem = idToBrandItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
}