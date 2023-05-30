const { ethers } = require("hardhat");
const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Potato", function () {
  // it("Play gives Potato to Player 1", async function () {
  //   const [owner, p1, p2] = await ethers.getSigners();

  //   const Potato = await ethers.getContractFactory("Potato");

  //   const potato = await Potato.deploy();

  //   await potato.connect(p1).openGame();

  //   const balance1 = await potato.balanceOf(p1.address);

  //   expect(await potato.totalSupply()).to.equal(balance1);
  // });

  // it("Play gives not more than 12 Potatoes", async function () {
  //   const [owner, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12] = await ethers.getSigners();

  //   const Potato = await ethers.getContractFactory("Potato");

  //   const potato = await Potato.deploy();

  //   await potato.connect(p1).openGame();
  //   await potato.connect(p2).openGame();
  //   await potato.connect(p3).openGame();
  //   await potato.connect(p4).openGame();
  //   await potato.connect(p6).openGame();
  //   await potato.connect(p5).openGame();
  //   await potato.connect(p7).openGame();
  //   await potato.connect(p8).openGame();
  //   await potato.connect(p9).openGame();
  //   await potato.connect(p10).openGame();
  //   await potato.connect(p11).openGame();

  //   expect(await potato.connect(p12).openGame()).to.be.revertedWith("Too many Potatoes");
  // });

  // it("Transfer from p1 to p4", async function () {
  //   const [owner, p1, p2, p3, p4, p5] = await ethers.getSigners();

  //   const Potato = await ethers.getContractFactory("Potato");

  //   const potato = await Potato.deploy();

  //   await potato.connect(p1).openGame();
  //   await potato.connect(p2).openGame();
  //   await potato.connect(p3).openGame();
    
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

  //   await potato.connect(p1).openGame();
  //   await potato.connect(p2).openGame();
  //   await potato.connect(p3).openGame();
    
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

  //   await potato.connect(p1).openGame();
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

  //   await potato.connect(p2).openGame();
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

  //   await potato.connect(p2).openGame();
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

  //   await potato.connect(p1).openGame();
  //   const t1 = await potato.getExplodeTime(1);
  //   await potato.connect(p2).openGame();
  //   const t2 = await potato.getExplodeTime(1);
  //   await potato.connect(p3).openGame();
  //   const t3 = await potato.getExplodeTime(1);
  //   await potato.connect(p4).openGame();
  //   const t4 = await potato.getExplodeTime(1);

  //   await expect(potato.connect(p5).openGame()).to.be.reverted;
  //   expect(await potato.getCount()).to.equal(4);

  //   await time.increaseTo(t1);

  //   await expect(potato.connect(p1).transferFrom(p1.address, p3.address, 1)).to.be.revertedWith("The token has already exploded!");

  //   await potato.connect(p5).openGame();
  // });

  it("Potatos to players", async function () {
    const [owner, p1, p2, p3, p4, p5, p6] = await ethers.getSigners();

    const Potato = await ethers.getContractFactory("Potato");
    const potato = await Potato.deploy();

    await potato.connect(p1).openGame();
    const t1 = await potato.getExplodeTime(1);
    await potato.connect(p2).joinGame(1);

    await expect(potato.connect(p1).transferFrom(p1.address, p2.address, 1)).to.be.reverted;

    await potato.connect(p3).joinGame(1);

    await expect(potato.connect(p1).transferFrom(p1.address, p2.address, 1)).to.be.reverted;

    await potato.connect(p4).joinGame(1);

    await potato.connect(p1).transferFrom(p1.address, p2.address, 1);
    await expect(potato.connect(p2).transferFrom(p2.address, p6.address, 1)).to.be.reverted;

    await expect(potato.connect(p5).joinGame(1)).to.be.reverted;

    await time.increaseTo(t1);
    await expect(potato.connect(p2).transferFrom(p2.address, p1.address, 1)).to.be.reverted;



  });

});