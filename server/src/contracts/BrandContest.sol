// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./BrandNFT.sol";
import './KonceptToken.sol';
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
 * @title Brand Contest Smart Contract
 * @author Nino De Kerpel
 * @notice A Smart Contract for organizing brand contests and rewarding winners with NFTs or Tokens.
 * @dev A Smart Contract for organizing brand contests and rewarding winners with NFTs or Tokens.
 */
contract BrandContest is Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _contestIds;

  BrandNFT public brandNFT;
  KonceptToken public konceptToken;

  /**
   * @dev Contract constructor for deployment
   * @param brandNFTAddress The address of the ERC721 NFT Contract.
   * @param konceptTokenAddress The address of the ERC20 Token Contract.
   */
  constructor(address brandNFTAddress, address konceptTokenAddress) {
    brandNFT = BrandNFT(brandNFTAddress);
    konceptToken = KonceptToken(konceptTokenAddress);
  }

  /**
   * @notice A struct is an object that has properties and defines the shape of a brand contest.
   * @dev Creating a Brand Contest Object / Map
   */
  struct Contest {
    uint contestId;
    string title;
    string description;
    uint256 startDate;
    uint256 endDate;
    address host;
    address winner;
    address rewardContract;
    uint256 rewardTokenId;
    bool ended;
  }
  /**
   * @dev Mapping over brand contests to keep up with all the contests that have been created.
   * In order to fetch a brand contest we need to know and pass its unique identifier.
   * @dev Mapping over contest attendees to keep up with all the users that have entered the contest.
   * In order to fetch attendees that have entered a contest we need to know and pass in the 
   * unique identifier of the contest.
   */
  mapping(uint256 => Contest) private _contests;
  mapping(uint256 => address[]) private _attendees;
  
  modifier contestExists(uint256 contestId) {
    require(contestId > 0 && contestId <= _contestIds.current(), "Contest does not exist");
    _;
  }
  modifier contestNotEnded(uint256 contestId) {
    require(!_contests[contestId].ended, "Contest has already ended");
    _;
  }
  modifier contestInProgress(uint256 contestId) {
    require(_contests[contestId].startDate <= block.timestamp, "Contest has not started yet");
    require(_contests[contestId].endDate >= block.timestamp, "Contest has already ended");
    _;
  }
  modifier notAttended(uint256 contestId, address attendee) {
    require(!hasAttended(contestId, attendee), "You have already attended the contest");
    _;
  }
  modifier contestValid(uint256 startDate, uint256 endDate){
    require(startDate < endDate, "Invalid contest dates");
    _;
  }

  /**
   * @dev An Event for when a brand contest gets created.
   * @param contestId The unique identifier of the brand contest.
   * @param title The title of the brand contest.
   * @param description The description of the brand contest.
   * @param startDate The start date of the brand contest.
   * @param endDate The end date of the brand contest.
   * @param host The address of the host of the brand contest. This will be the contract deployer or the brand owner (msg.sender)
   * @param winner The address of the winner of the brand contest.
   * @param rewardContract The address of the contract that is responsible for transfering the reward. 
   * Available rewards are a brand- NFT or (in-house) Tokens.
   * @param rewardTokenId The unique identifier of the reward token in case of a NFT reward, the tokenId of the NFT.
   * @param ended A boolean indicates true or false wether the contest has ended or not
   */
  event BrandContestCreated (
    uint256 indexed contestId,
    string title,
    string description,
    uint256 startDate,
    uint256 endDate,
    address host,
    address winner,
    address rewardContract,
    uint256 rewardTokenId,
    bool ended
  );
  /**
   * @dev An Event for when a brand contest ends.
   */
  event BrandContestEnded (
    uint256 indexed contestId,
    address winner,
    address rewardContract,
    uint256 rewardTokenId
  );
  /**
   * @dev Creates a new brand contest.
   * @param title The title of the contest.
   * @param description The description of the contest.
   * @param startDate The start date of the contest.
   * @param endDate The end date of the contest.
   * @param rewardContract The address of the contract that is responsible for transfering the reward. 
   * Available rewards are a brand- NFT or (in-house) Tokens.
   * @param rewardTokenId The unique identifier of the reward token in case of a NFT reward, the tokenId of the NFT.
   */
  function createBrandContest(
    string memory title, 
    string memory description, 
    uint256 startDate, 
    uint256 endDate,
    address rewardContract,
    uint256 rewardTokenId
  ) external onlyOwner contestValid(startDate, endDate) {    
    _contestIds.increment();
    uint256 newContestId = _contestIds.current();

    _contests[newContestId] = Contest(
      newContestId,
      title,
      description,
      startDate,
      endDate,
      msg.sender,
      address(0),
      rewardContract,
      rewardTokenId,
      false
    );
    /**
     * @dev Firing of the event that can be picked up by the client application
     */
    emit BrandContestCreated(
      newContestId,
      title,
      description,
      startDate,
      endDate,
      msg.sender,
      address(0),
      rewardContract,
      rewardTokenId,
      false
    );
  }
  /**
   * @dev Ends a brand contest and transfers the reward to the winner.
   * @param contestId The unique identifier of the brand contest.
   * @param winner The address of the contest winner.
   */
  function endBrandContest(uint256 contestId, address winner) 
    external 
    onlyOwner
    contestExists(contestId) 
    contestNotEnded(contestId) 
    contestInProgress(contestId)
  {
    _contests[contestId].ended = true;
    _contests[contestId].winner = winner;
    rewardWinner(contestId);
    emit BrandContestEnded(contestId, winner, _contests[contestId].rewardContract, _contests[contestId].rewardTokenId);
  }
  /**
   * @dev Allows an attendee to participate in a brand contest.
   * @param contestId The unique identifier of the contest to attend
   */
  function enterContest(uint256 contestId)
    external
    contestExists(contestId)
    contestNotEnded(contestId)
    contestInProgress(contestId)
    notAttended(contestId, msg.sender)
  {
    _attendees[contestId].push(msg.sender);
  }
  /**
   * @dev Rewards the contest winner with the predefined reward.
   * @param contestId The unique identifier of the contest.
   */
  function rewardWinner(uint256 contestId) private contestNotEnded(contestId) onlyOwner{
    Contest storage contest = _contests[contestId];
    require(
            contest.rewardContract == address(brandNFT) || contest.rewardContract == address(konceptToken),
            "Invalid reward contract"
        );
    if(contest.rewardContract == address(brandNFT)){
      ERC721(brandNFT).transferFrom(address(this), contest.winner, contest.rewardTokenId);
    }
    else if (contest.rewardContract == address(konceptToken)){
      konceptToken.transferTokens(contest.winner, 1000);
    }
  }
  /**
   * @dev Gets the list of contests that are currently in progress.
   * @return An array of Events (struct) in progress.
   */
  function fetchContestsInProgress() public view returns (Contest[] memory){
    uint256 count = 0;
    for(uint256 i = 0; i < _contestIds.current(); i++){
      if(!_contests[i].ended){
        count++;
      }
    }
    Contest[] memory contestsInProgress = new Contest[](count);
    uint256 currentIndex = 0; 
    for(uint256 i = 0; i < _contestIds.current(); i++){
      if(!_contests[i].ended) {
        contestsInProgress[currentIndex] = _contests[i];
        currentIndex++;
      }
    }
    return contestsInProgress;
  }
  /**
   * @dev Gets the list of contests that have ended.
   * @return An array of Contest structs representing the ended contests.
   */
  function fetchContestsEnded() public view returns (Contest[] memory){
    uint256 count = 0;
    for (uint256 i = 0; i < _contestIds.current(); i++){
      if(_contests[i].ended){
        count++;
      }
    }
    Contest[] memory contestsEnded = new Contest[](count);
    uint256 currentIndex = 0;
    for (uint256 i = 0; i < _contestIds.current(); i++){
      if(_contests[i].ended){
        contestsEnded[currentIndex] = _contests[i];
        currentIndex++;
      }
    }
    return contestsEnded;
  }
  /**
   * @dev Gets the list of addresses attended by a contest.
   * @param contestId The unique identifier of the constest.
   * @return An array of addresses attended by a contest.
   */
  function fetchAttendees(uint256 contestId) external view returns (address[] memory) {
    return _attendees[contestId];
  }
  /**
   * @dev Checks if a user has attended a contest with given unique identifier
   * @param contestId The unique identifier of the contest.
   * @param attendee The address of the attendee.
   * @return A boolean indicating whether the attendee has attended the contest or not.
   */
  function hasAttended(uint256 contestId, address attendee) private view returns (bool){
    address[] memory contestIdToAttendees = _attendees[contestId];
    for(uint i = 0; i < contestIdToAttendees.length; i++){
      if(contestIdToAttendees[i] == attendee){
        return true;
      }
    }
    return false;
  }
}