const hre = require("hardhat");

const main = async () => {
    const rsvpContractFactory = await hre.ethers.getContractFactory("Web3RSVP");
    const rsvpContract = await rsvpContractFactory.deploy();
    await rsvpContract.deployed();
    console.log("Contract deployed to:", rsvpContract.address);

    const [deployer, address1, address2] = await hre.ethers.getSigners();

    let deposit = hre.ethers.utils.parseEther("1");
    let maxCapacity = 3;
    let timestamp = 1718926200;
    let eventDataCID =
         "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";

    let txn = await rsvpContract.createNewEvent(
        timestamp,
        deposit,
        maxCapacity,
        eventDataCID
    );
    let wait = await txn.wait();
    console.log("NEW EVENT CREATED:", wait.events[0].event, wait.events[0].args);
          
    let eventID = wait.events[0].args.eventID;
    console.log("EVENT ID:", eventID);

    txn = await rsvpContract.createNewRSVP(eventID, { value: deposit });
    wait = await txn.wait();
    console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);

    txn = await rsvpContract
     .connect(address1)
     .createNewRSVP(eventID, { value: deposit });
    wait = await txn.wait();
    console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);

    txn = await rsvpContract
     .connect(address2)
     .createNewRSVP(eventID, { value: deposit });
    wait = await txn.wait();
    console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);

    txn = await rsvpContract.confirmAllAttendees(eventID);
    wait = await txn.wait();
    wait.events.forEach((event) =>
        console.log("CONFIRMED:", event.args.attendeeAddress)
    );

    // wait 10 years
    await hre.network.provider.send("evm_increaseTime", [15778800000000]);

    txn = await rsvpContract.withdrawUnclaimedDeposits(eventID);
    wait = await txn.wait();
    console.log("WITHDRAWN:", wait.events[0].event, wait.events[0].args);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();


/**
 * dmolina@DMCs-MacBook-Pro-3 web3rsvp % npm run script

> web3rsvp@1.0.0 script
> node scripts/run.js

Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
NEW EVENT CREATED: NewEventCreated [
  '0x8a054be2ea682cd0bdd68f85c9e0aa6d8ac442d7b2716f0a1baab0954490af68',
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  BigNumber { value: "1718926200" },
  BigNumber { value: "3" },
  BigNumber { value: "1000000000000000000" },
  'bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi',
  eventID: '0x8a054be2ea682cd0bdd68f85c9e0aa6d8ac442d7b2716f0a1baab0954490af68',
  creatorAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  eventTimestamp: BigNumber { value: "1718926200" },
  maxCapacity: BigNumber { value: "3" },
  deposit: BigNumber { value: "1000000000000000000" },
  eventDataCID: 'bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi'
]
EVENT ID: 0x8a054be2ea682cd0bdd68f85c9e0aa6d8ac442d7b2716f0a1baab0954490af68
NEW RSVP: NewRSVP [
  '0x8a054be2ea682cd0bdd68f85c9e0aa6d8ac442d7b2716f0a1baab0954490af68',
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  eventID: '0x8a054be2ea682cd0bdd68f85c9e0aa6d8ac442d7b2716f0a1baab0954490af68',
  attendeeAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
]
NEW RSVP: NewRSVP [
  '0x8a054be2ea682cd0bdd68f85c9e0aa6d8ac442d7b2716f0a1baab0954490af68',
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  eventID: '0x8a054be2ea682cd0bdd68f85c9e0aa6d8ac442d7b2716f0a1baab0954490af68',
  attendeeAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
]
NEW RSVP: NewRSVP [
  '0x8a054be2ea682cd0bdd68f85c9e0aa6d8ac442d7b2716f0a1baab0954490af68',
  '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  eventID: '0x8a054be2ea682cd0bdd68f85c9e0aa6d8ac442d7b2716f0a1baab0954490af68',
  attendeeAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
]
CONFIRMED: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
CONFIRMED: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
CONFIRMED: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
WITHDRAWN: DepositsPaidOut [
  '0x8a054be2ea682cd0bdd68f85c9e0aa6d8ac442d7b2716f0a1baab0954490af68',
  eventID: '0x8a054be2ea682cd0bdd68f85c9e0aa6d8ac442d7b2716f0a1baab0954490af68'
]

 */