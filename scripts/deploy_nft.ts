import 'dotenv/config';
import { ethers } from "hardhat";
import { BigNumber, Contract, Wallet, utils } from "ethers";


const func = async function(){
    const [ deployer ] = await ethers.getSigners();
    console.log('loaded deployer', deployer.address);

    const initFile = `addresses_init.json`;
    const addresses = require(`../init/${initFile}`);
    const fs = require("fs");

    function writeFiles() {
    fs.writeFileSync(`${__dirname}/../init/${initFile}`, JSON.stringify(addresses, null, 4));
    }

    process.on("SIGINT", function () {
      writeFiles();
      console.log("write addresses.json already");
      process.exit();
    });

    if (!addresses['Exchange']) {
        console.error('unexpected Exchange address.');
        return;
    }

    const name = "MyNFT1";
    const symbol = "mnft1";
    const uri = "uri://mnft?id=";
    if(addresses['nft_'+name]==null){

        //.connect(deployer)
        const StoredNFT = await ethers.getContractFactory("StoredNFT");
        const nft = await StoredNFT.deploy(name,symbol,uri,{gasPrice:0});
        await nft.deployed();
        await nft.addMintRole(addresses['Exchange'],{gasPrice:0});
        addresses['nft_'+name] = nft.address;

        writeFiles();

    }

    console.log('StoredNFT Deployed as',name,'finished:', addresses['nft_'+name]);
};

// export default func;
func();