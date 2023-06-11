// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Brand Event Smart Contract
 * @author Nino De Kerpel
 * @notice A Smart Contract for organizing brand events.
 * @dev A Smart Contract for organizing brand events.
 */
contract BrandEvent is Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _eventIds; // unique identifier for each brand event that gets created

  constructor() {}

    /**
   * @notice A struct is an object that has properties and defines the shape of a brand event.
   * @dev Creating a Brand Event Object / Map
   */
  struct Event {
    uint256 eventId;
    string title;
    string description;
    uint256 startDate;
    uint256 endDate;
    address host;
    bool ended;
  }
  /**
   * @dev Mapping over brand events to keep up with all the items that have been created.
   * In order to fetch a brand contest we need to know and pass its unique identifier.
   * @dev Mapping over event attendees to keep up with all the users that have entered the event.
   * In order to fetch attendees that have entered a event we need to know and pass in the 
   * unique identifier of the event.
   */
  mapping(uint256 => Event) private _events;
  mapping(uint256 => address[]) private _attendees;

  modifier eventValid(uint256 startDate, uint256 endDate){
    require(startDate < endDate, "Invalid event dates");
    _;
  }
  modifier eventExists(uint256 eventId){
    require(eventId > 0 && eventId <= _eventIds.current(), "Event does not exist");
    _;
  }
  modifier eventNotEnded(uint256 eventId){
    require(!_events[eventId].ended, "Event has already ended");
    _;
  }
  modifier eventInProgress(uint256 eventId){
    require(_events[eventId].startDate <= block.timestamp, "Event has not started yet.");
    require(_events[eventId].endDate >= block.timestamp, "Event has already ended.");
    _;
  }
  modifier notAttended(uint256 eventId, address attendee) {
    require(!hasAttended(eventId, attendee), "You have already attended the contest");
    _;
  }
  /**
   * @dev An Event for when a brand event gets created
   * @param eventId The unique identifier of the brand event.
   * @param title The title of the brand event.
   * @param description The description of the brand event.
   * @param startDate The start date of the brand event.
   * @param endDate The end date of the brand event.
   * @param host The address of the host of the brand event. This will be the contract deployer or the brand owner (msg.sender)
   * @param ended A boolean indicates true or false wether the contest has ended or not
   */
  event EventCreated(
    uint256 indexed eventId,
    string title, 
    string description,
    uint256 startDate, 
    uint256 endDate,
    address host,
    bool ended
  );
  /**
   * @dev An Event for when a brand event ends
   */
  event EventEnded(
    uint256 eventId,
    string title, 
    string description,
    uint256 startDate, 
    uint256 endDate,
    address host,
    bool ended
  );
  /**
   * @dev Creates a new brand event.
   * @param title The title of the event.
   * @param description The description of the event.
   * @param startDate The start date of the event.
   * @param endDate The end date of the event.
   */
  function createEvent(
    string memory title,
    string memory description,
    uint256 startDate,
    uint256 endDate
  ) external onlyOwner eventValid(startDate, endDate) {
    _eventIds.increment();
    uint256 newEventId = _eventIds.current();

    _events[newEventId] = Event(
      newEventId,
      title,
      description,
      startDate,
      endDate,
      msg.sender,
      false
    );
    /**
     * @dev Firing of the event that can be picked up by the client application
     */
    emit EventCreated(
      newEventId,
      title,
      description,
      startDate,
      endDate,
      msg.sender,
      false
    );
  }
  /**
   * @dev Ends a brand event.
   */
  function endEvent(uint256 eventId) 
    external 
    onlyOwner 
    eventExists(eventId)
    eventNotEnded(eventId)
    eventInProgress(eventId)
    {
    _events[eventId].ended = true;
    emit EventEnded(
      eventId,
      _events[eventId].title,
      _events[eventId].description,
      _events[eventId].startDate,
      _events[eventId].endDate,
      _events[eventId].host,
      _events[eventId].ended
    );
  }
  /**
   * @dev Allows an attendee to attend to a brand event
   */
  function attendEvent(uint256 eventId) 
    external 
    eventExists(eventId)
    eventNotEnded(eventId)
    eventInProgress(eventId)
  {
    _attendees[eventId].push(msg.sender);
  }
  /**
   * @dev Gets the list of contests that are currently in progress.
   * @return An array of events (struct) in progress.
   */
  function fetchEventsInProgress() public view returns (Event[] memory) {
    uint256 count = 0;
    for(uint256 i = 0; i < _eventIds.current(); i++) {
      if(!_events[i].ended){
        count++;
      }
    }
    Event[] memory eventsInProgress = new Event[](count);
    uint256 currentIndex = 0;
    for(uint256 i = 0; i < _eventIds.current(); i++) {
      if(_events[i].ended) {
        eventsInProgress[currentIndex] = _events[i];
        currentIndex++;
      }
    }
    return eventsInProgress;
  }
  /**
   * @dev Gets the list of events that have ended.
   * @return An array of events (struct) representing the ended contests.
   */
  function fetchEventsEnded() public view returns (Event[] memory) {
    uint256 count = 0;
    for(uint256 i = 0; i < _eventIds.current(); i++){
      if(_events[i].ended){
        count++;
      }
    }
    Event[] memory eventsEnded = new Event[](count);
    uint256 currentIndex = 0;
    for(uint256 i = 0; i < _eventIds.current(); i++){
      if(_events[i].ended){
        eventsEnded[currentIndex] = _events[i];
        currentIndex++;
      }
    }
    return eventsEnded;
  }
  /**
   * @dev Gets the list of addresses attended of an event.
   * @param eventId The unique identifier of the event.
   * @return An array of addresses attended of an event.
   */
  function fetchAttendees(uint256 eventId) external view returns (address[] memory) {
    return _attendees[eventId];
  }
  /**
   * @dev Checks if a user has attended an event with given unique identifier
   * @param eventId The unique identifier of the event.
   * @param attendee The address of the attendee.
   * @return A boolean indicating whether the attendee has attended the event or not.
   */
  function hasAttended(uint256 eventId, address attendee) private view returns (bool) {
    address[] memory eventIdToAttendees = _attendees[eventId];
    for(uint i = 0; i < eventIdToAttendees.length; i++){
      if(eventIdToAttendees[i] == attendee){
        return true;
      }
    }
    return false;
  }
}