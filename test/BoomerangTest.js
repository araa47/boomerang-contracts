const Boomerang = artifacts.require("Boomerang");
const { time, snapshot } = require('@openzeppelin/test-helpers');
const { afterEach } = require('node:test');

var stateSnapShot; 

contract("Boomerang", accounts => {
    let boomerangInstance;

    beforeEach(async () => {
        boomerangInstance = await Boomerang.new();
        stateSnapShot = await snapshot()
    });
    afterEach(async () => {
        await stateSnapShot.restore()
    }); 


    it("can create a new Boomerang", async () => {
        const expiryTime = Math.floor(Date.now() / 1000) +  time.duration.years(10).toNumber(); // 10 years from now
        const updateFrequency =  time.duration.years(1).toNumber(); // 1 year

        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);

        const boomerang = await boomerangInstance.boomerangs(0);
        assert.equal(boomerang.expiryTime, expiryTime);
        assert.equal(boomerang.updateFrequency, updateFrequency);
        assert.equal(boomerang.creator, accounts[0]);
    });

    it("can check in a Boomerang that is not expired", async () => {
        const expiryTime = Math.floor(Date.now() / 1000) +  time.duration.years(10).toNumber(); // 10 years from now
        const updateFrequency =  time.duration.years(1).toNumber(); // 1 year

        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);

        await boomerangInstance.checkIn(0);

        const boomerang = await boomerangInstance.boomerangs(0);
    });

    it("correct count of Boomerang", async () => {
        const expiryTime = Math.floor(Date.now() / 1000) +  time.duration.years(10).toNumber(); // 10 years from now
        const updateFrequency =  time.duration.years(1).toNumber(); // 1 year

        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);
        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);

        const boomerangs = await boomerangInstance.getTotalBoomerangs();
        assert.equal(boomerangs, 2);
        
    });


    it("should not check in an expired Boomerang", async () => {
        const expiryTime = Math.floor(Date.now() / 1000) +  time.duration.years(10).toNumber(); // 10 years from now
        const updateFrequency =  time.duration.years(1).toNumber(); // 1 year

        
        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);

        // Advance the block timestamp by weeks, to simulate expiry without update
        await time.increase(time.duration.years(12)); 

        try {
            await boomerangInstance.checkIn(0);
            assert.fail("Expected an exception");
        } catch (error) {
            assert.equal(error.reason, "Boomerang is unlocked or expired");
        }
        await stateSnapShot.restore()
    });

    it("should not check in an unlocked Boomerang that was not updated on time", async () => {
        const expiryTime = Math.floor(Date.now() / 1000)  + time.duration.years(10).toNumber(); // 10 years from now 
        const updateFrequency = time.duration.years(1).toNumber(); // 1 year

        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);
        // Advance the block timestamp, to simulate unlock without update
        await time.increase(time.duration.years(2));

        try {
            await boomerangInstance.checkIn(0);
            assert.fail("Expected an exception");
        } catch (error) {
            assert.equal(error.reason, "Boomerang is unlocked or expired");
        }
        await stateSnapShot.restore()

    });

    it("should check if a Boomerang is unlocked if no check in" , async () => {
        const expiryTime =  Math.floor(Date.now() / 1000) + time.duration.years(10).toNumber(); // 10 years from now 
        const updateFrequency = time.duration.weeks(1).toNumber() // 1 week

        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);

        // Not expired right after creation
        const isUnlocked = await boomerangInstance.isUnlocked(0);
        assert.equal(isUnlocked, false);
      
        // Advance the block timestamp by weeks, to simulate expiry without update
        await time.increase(time.duration.weeks(2)); 


        const isUnlockedNow = await boomerangInstance.isUnlocked(0);
        assert.equal(isUnlockedNow, true);
        await stateSnapShot.restore()
    });

    it("should be locked if a Boomerang is not updated enough times", async () => {
        const expiryTime = Math.floor(Date.now() / 1000) + time.duration.weeks(10).toNumber(); // 10 weeks from now
        const updateFrequency = time.duration.weeks(1).toNumber(); // 1 week
        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);
      
        // Not expired right after creation
        const isUnlocked = await boomerangInstance.isUnlocked(0);
        assert.equal(isUnlocked, false);
      
        // Update the Boomerang every week 9 times
        for (let i = 0; i < 9; i++) {
            await boomerangInstance.checkIn(0);
            await time.increase(time.duration.weeks(1));
        }
      
        // Check that the Boomerang is still locked as it isn't expired
        const isUnlockedNow = await boomerangInstance.isUnlocked(0);
        assert.equal(isUnlockedNow, false);
        await stateSnapShot.restore()
      });
});
