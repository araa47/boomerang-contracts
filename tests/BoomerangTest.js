const Boomerang = artifacts.require("Boomerang");

contract("Boomerang", accounts => {
    let boomerangInstance;

    beforeEach(async () => {
        boomerangInstance = await Boomerang.new();
    });

    it("should create a new Boomerang", async () => {
        const expiryTime = Math.floor(Date.now() / 1000) + 315360000; // 10 years from now
        const updateFrequency = 31536000; // 1 year

        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);

        const boomerang = await boomerangInstance.boomerangs(0);
        assert.equal(boomerang.expiryTime, expiryTime);
        assert.equal(boomerang.updateFrequency, updateFrequency);
        assert.equal(boomerang.creator, accounts[0]);
        assert.equal(boomerang.locked, true);
    });

    it("should check in a Boomerang", async () => {
        const expiryTime = Math.floor(Date.now() / 1000) + 315360000; // 10 years from now
        const updateFrequency = 31536000; // 1 year

        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);

        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

        await boomerangInstance.checkIn(0);

        const boomerang = await boomerangInstance.boomerangs(0);
        assert.equal(boomerang.locked, true);
    });

    it("should not check in an expired Boomerang", async () => {
        const expiryTime = Math.floor(Date.now() / 1000) + 1; // 1 second from now
        const updateFrequency = 31536000; // 1 year

        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);

        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds

        try {
            await boomerangInstance.checkIn(0);
            assert.fail("Expected an exception");
        } catch (error) {
            assert.equal(error.reason, "Boomerang has expired");
        }
    });

    it("should not check in an unlocked Boomerang", async () => {
        const expiryTime = Math.floor(Date.now() / 1000) + 315360000; // 10 years from now
        const updateFrequency = 31536000; // 1 year

        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);

        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

        await boomerangInstance.checkIn(0);

        try {
            await boomerangInstance.checkIn(0);
            assert.fail("Expected an exception");
        } catch (error) {
            assert.equal(error.reason, "Boomerang is already unlocked");
        }
    });

    it("should check if a Boomerang is expired", async () => {
        const expiryTime = Math.floor(Date.now() / 1000) + 315360000; // 10 years from now
        const updateFrequency = 31536000; // 1 year

        await boomerangInstance.createBoomerang(expiryTime, updateFrequency);

        const isExpired = await boomerangInstance.isExpired(0);
        assert.equal(isExpired, false);

        await new Promise(resolve => setTimeout(resolve, 100000000)); // Wait for 3 years

        const isExpiredNow = await boomerangInstance.isExpired(0);
        assert.equal(isExpiredNow, true);
    });
});
