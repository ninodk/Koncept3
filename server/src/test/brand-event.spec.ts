import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";
import { BrandEvent } from "../typechain-types";

describe("BrandEvent", async () => {
  it("should create an event", async () => {
    const signers = await ethers.getSigners();
    let brandEvent: BrandEvent;
    const brandEventFactory = await ethers.getContractFactory(
      "BrandEvent",
      signers[0]
    );
    brandEvent = await brandEventFactory.deploy();
    await brandEvent.deployed();
    const brandEventAddress = brandEvent.address;

    const eventTitle = "Event Title";
    const eventDescription = "Event Description";
    const startDate = Math.floor(Date.now() / 1000); // Current timestamp
    const endDate = startDate + 86400; // 1 hour from start time

    await brandEvent.createEvent(
      eventTitle,
      eventDescription,
      startDate,
      endDate
    );

    let activeEvents = await brandEvent.fetchEventsInProgress();

    let humanReadableEvents = await Promise.all(
      activeEvents.map(async (i): Promise<any> => {
        let event = {
          eventId: i.eventId.toString(),
          title: i.title.toString(),
          description: i.description.toString(),
          startDate: i.startDate.toString(),
          endDate: i.endDate.toString(),
          host: i.host.toString(),
          ended: i.ended.toString(),
        };
        return event;
      })
    );
    console.log("human readable events: ", humanReadableEvents);
  });
});
