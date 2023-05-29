const { ethers } = require("hardhat");

const { expect } = require("chai");

const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Potato", function () {
  // it("Play gives Potato to Player 1", async function () {
  //   const [owner, p1, p2] = await ethers.getSigners();

  //   const Potato = await ethers.getContractFactory("Potato");

  //   const potato = await Potato.deploy();

  //   await potato.connect(p1).play();

  //   const balance1 = await potato.balanceOf(p1.address);

  //   expect(await potato.totalSupply()).to.equal(balance1);
  // });

  // it("Play gives not more than 12 Potatoes", async function () {
  //   const [owner, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12] = await ethers.getSigners();

  //   const Potato = await ethers.getContractFactory("Potato");

  //   const potato = await Potato.deploy();

  //   await potato.connect(p1).play();
  //   await potato.connect(p2).play();
  //   await potato.connect(p3).play();
  //   await potato.connect(p4).play();
  //   await potato.connect(p6).play();
  //   await potato.connect(p5).play();
  //   await potato.connect(p7).play();
  //   await potato.connect(p8).play();
  //   await potato.connect(p9).play();
  //   await potato.connect(p10).play();
  //   await potato.connect(p11).play();

  //   expect(await potato.connect(p12).play()).to.be.revertedWith("Too many Potatoes");
  // });

  // it("Transfer from p1 to p4", async function () {
  //   const [owner, p1, p2, p3, p4, p5] = await ethers.getSigners();

  //   const Potato = await ethers.getContractFactory("Potato");

  //   const potato = await Potato.deploy();

  //   await potato.connect(p1).play();
  //   await potato.connect(p2).play();
  //   await potato.connect(p3).play();
    
  //   const explodeTime1 = await potato.getExplodeTime(1);
  //   const explodeTime2 = await potato.getExplodeTime(2);
  //   const explodeTime3 = await potato.getExplodeTime(3);

  //   await potato.setExplodeTime(1, 60);
  //   await potato.setExplodeTime(2, 30);
  //   await potato.setExplodeTime(3, 120);

  //   const t1 = await potato.getExplodeTime(1);
  //   const t2 = await potato.getExplodeTime(2);
  //   const t3 = await potato.getExplodeTime(3);

  //   console.log(t1);
  //   console.log(t2);
  //   console.log(t3);

  //   await potato.connect(p1).transferFrom(p1.address, p4.address, 1);

  //   expect(await potato.balanceOf(p1.address)).to.equal(0);
  //   expect(await potato.balanceOf(p4.address)).to.equal(1);
  // });

  // it("Cannot transfer from p1 to p4 after exploded", async function () {
  //   const [owner, p1, p2, p3, p4, p5] = await ethers.getSigners();

  //   const Potato = await ethers.getContractFactory("Potato");

  //   const potato = await Potato.deploy();

  //   await potato.connect(p1).play();
  //   await potato.connect(p2).play();
  //   await potato.connect(p3).play();
    
  //   const explodeTime1 = await potato.getExplodeTime(1);
  //   const explodeTime2 = await potato.getExplodeTime(2);
  //   const explodeTime3 = await potato.getExplodeTime(3);

  //   console.log(explodeTime1);
  //   console.log(explodeTime2);
  //   console.log(explodeTime3);

  //   await potato.connect(p1).transferFrom(p1.address, p4.address, 1);

  //   expect(await potato.balanceOf(p1.address)).to.equal(0);
  //   expect(await potato.balanceOf(p4.address)).to.equal(1);

  //   await time.increase(explodeTime1); 

  //   expect(await potato.connect(p4).transferFrom(p4.address, p5.address, 1)).to.be.revertedWith("Time passed");
  // });

  // it("Potato explodes after transfer after timeout", async function () {
  //   const [owner, p1, p2, p3, p4, p5] = await ethers.getSigners();

  //   const Potato = await ethers.getContractFactory("Potato");
  //   const potato = await Potato.deploy();

  //   await potato.connect(p1).play();
  //   const explodeTime1 = await potato.getExplodeTime(1);


  //   await potato.connect(p1).transferFrom(p1.address, p4.address, 1);

  //   expect(await potato.balanceOf(p1.address)).to.equal(0);
  //   expect(await potato.balanceOf(p4.address)).to.equal(1);

  //   await time.increase(explodeTime1); 
        
  //   await expect(potato.connect(p4).transferFrom(p4.address, p5.address, 1)).to.be.revertedWith("The token has already exploded!");

  //   expect(await potato.balanceOf(p4.address)).to.equal(1);
  //   expect(await potato.balanceOf(p5.address)).to.equal(0);

  //   expect(await potato.getWins(p1.address)).to.equal(1);
  //   expect(await potato.getWins(p4.address)).to.equal(0);
  //   expect(await potato.getWins(p5.address)).to.equal(0);

  //   await potato.connect(p2).play();
  //   const explodeTime2 = await potato.getExplodeTime(2);

  //   await potato.connect(p2).transferFrom(p2.address, p1.address, 2);
  //   await potato.connect(p1).transferFrom(p1.address, p3.address, 2);
  //   await potato.connect(p3).transferFrom(p3.address, p4.address, 2);

  //   await time.increase(explodeTime2); 

  //   await expect(potato.connect(p4).transferFrom(p4.address, p5.address, 2)).to.be.revertedWith("The token has already exploded!");
  
  //   expect(await potato.getWins(p1.address)).to.equal(2);
  //   expect(await potato.getWins(p2.address)).to.equal(1);
  //   expect(await potato.getWins(p3.address)).to.equal(1);
  //   expect(await potato.getWins(p4.address)).to.equal(0);
  //   expect(await potato.getWins(p5.address)).to.equal(0);

  //   await potato.connect(p2).play();
  //   const explodeTime3 = await potato.getExplodeTime(2);

  //   await potato.connect(p2).transferFrom(p2.address, p1.address, 3);
  //   await potato.connect(p1).transferFrom(p1.address, p3.address, 3);
  //   await potato.connect(p3).transferFrom(p3.address, p4.address, 3);

  //   await time.increase(explodeTime3); 

  //   await expect(potato.connect(p4).transferFrom(p4.address, p5.address, 3)).to.be.revertedWith("The token has already exploded!");
  
  //   expect(await potato.getWins(p1.address)).to.equal(3);
  //   expect(await potato.getWins(p2.address)).to.equal(2);
  //   expect(await potato.getWins(p3.address)).to.equal(2);
  //   expect(await potato.getWins(p4.address)).to.equal(0);
  //   expect(await potato.getWins(p5.address)).to.equal(0);

  //   expect(await potato.getTodameBalance(p1.address)).to.equal(3);
  // });

  // it("Potato explodes after transfer after timeout", async function () {
  //   const [owner, p1, p2, p3, p4, p5, p6] = await ethers.getSigners();

  //   const Potato = await ethers.getContractFactory("Potato");
  //   const potato = await Potato.deploy();

  //   await potato.connect(p1).play();
  //   const t1 = await potato.getExplodeTime(1);
  //   await potato.connect(p2).play();
  //   const t2 = await potato.getExplodeTime(1);
  //   await potato.connect(p3).play();
  //   const t3 = await potato.getExplodeTime(1);
  //   await potato.connect(p4).play();
  //   const t4 = await potato.getExplodeTime(1);

  //   await expect(potato.connect(p5).play()).to.be.reverted;
  //   expect(await potato.getCount()).to.equal(4);

  //   await time.increaseTo(t1);

  //   await expect(potato.connect(p1).transferFrom(p1.address, p3.address, 1)).to.be.revertedWith("The token has already exploded!");

  //   await potato.connect(p5).play();
  // });

  it("Potatos to players", async function () {
    const [owner, p1, p2, p3, p4, p5, p6] = await ethers.getSigners();

    const Potato = await ethers.getContractFactory("Potato");
    const potato = await Potato.deploy();

    await potato.connect(p1).play();
    const t1 = await potato.getExplodeTime(1);
    await potato.connect(p2).join(1);

    await expect(potato.connect(p1).transferFrom(p1.address, p2.address, 1)).to.be.reverted;

    await potato.connect(p3).join(1);

    await expect(potato.connect(p1).transferFrom(p1.address, p2.address, 1)).to.be.reverted;

    await potato.connect(p4).join(1);

    await potato.connect(p1).transferFrom(p1.address, p2.address, 1);
    await expect(potato.connect(p2).transferFrom(p2.address, p6.address, 1)).to.be.reverted;

    await expect(potato.connect(p5).join(1)).to.be.reverted;

    await time.increaseTo(t1);
    await expect(potato.connect(p2).transferFrom(p2.address, p1.address, 1)).to.be.reverted;



  });

});



// describe("Potato", function () {
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//   async function deployOnePotato() {
//     // Contracts are deployed using the first signer/account by default
//     const [owner, a, b] = await ethers.getSigners();

//     const Potato = await ethers.getContractFactory("Potato");
//     const potato = await Potato.deploy();

//     return { potato, owner, a, b };
//   }

//   describe("Deployment", function () {
//     it("Should set the right owner", async function () {
//       const { potato, owner } = await loadFixture(deployOnePotato);

//       expect(await potato.owner()).to.equal(owner.address);
//     });

//     it("Should receive and store the funds to lock", async function () {
//       const { lock, lockedAmount } = await loadFixture(
//         deployOnePotato
//       );

//       expect(await ethers.provider.getBalance(lock.address)).to.equal(
//         lockedAmount
//       );
//     });

//     it("Should fail if the unlockTime is not in the future", async function () {
//       // We don't use the fixture here because we want a different deployment
//       const latestTime = await time.latest();
//       const Lock = await ethers.getContractFactory("Lock");
//       await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
//         "Unlock time should be in the future"
//       );
//     });
//   });

//   describe("Withdrawals", function () {
//     describe("Validations", function () {
//       it("Should revert with the right error if called too soon", async function () {
//         const { lock } = await loadFixture(deployOnePotato);

//         await expect(lock.withdraw()).to.be.revertedWith(
//           "You can't withdraw yet"
//         );
//       });

//       it("Should revert with the right error if called from another account", async function () {
//         const { lock, unlockTime, otherAccount } = await loadFixture(
//           deployOnePotato
//         );

//         // We can increase the time in Hardhat Network
//         await time.increaseTo(unlockTime);

//         // We use lock.connect() to send a transaction from another account
//         await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
//           "You aren't the owner"
//         );
//       });

//       it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
//         const { lock, unlockTime } = await loadFixture(
//           deployOnePotato
//         );

//         // Transactions are sent using the first signer by default
//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).not.to.be.reverted;
//       });
//     });

//     describe("Events", function () {
//       it("Should emit an event on withdrawals", async function () {
//         const { lock, unlockTime, lockedAmount } = await loadFixture(
//           deployOnePotato
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw())
//           .to.emit(lock, "Withdrawal")
//           .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
//       });
//     });

//     describe("Transfers", function () {
//       it("Should transfer the funds to the owner", async function () {
//         const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
//           deployOnePotato
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).to.changeEtherBalances(
//           [owner, lock],
//           [lockedAmount, -lockedAmount]
//         );
//       });
//     });
//   });
// });
