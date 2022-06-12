const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const fs = require('fs');

import { BigNumber, Contract, Wallet, utils } from "ethers";


const addr0 = utils.getAddress("0x0000000000000000000000000000000000000000");
const w1Addr = "0xb0c341a5d3ee2941f06c8bc95ff247eeb52e59ee3ab04404837bc60edfaf1d3a";

var addresses = require('./addresses_int.json');
function writeFiles(){
    fs.writeFileSync(`${__dirname}/addresses_int.json`, JSON.stringify(addresses, null, 4));
}
process.on('SIGINT',function(){
    writeFiles();
    console.log("write addresses.json already");
    process.exit();
});
async function loadOrDeploy(thiz: any, key: string, hasAddress: boolean,
    deploy: (t:any,a:string)=>any)
{   
    thiz[key] = await deploy(thiz,addresses[key]);
    if(hasAddress){
        addresses[key] = thiz[key].address;
    }else{
        addresses[key] = thiz[key];
    }
}

describe("NFT contract", function () {
  before(async function () {
    const [owner] = await ethers.getSigners();
    this.owner = owner;
    this.w1 = new Wallet(w1Addr, this.owner.provider);
    console.log("wallet address:",this.owner.address,this.w1.address);

    const Exchange = await ethers.getContractFactory("Exchange");
    await loadOrDeploy(this,"Exchange",true,async (thiz,addr)=>{
        if(addr==null){
            const c = await Exchange.deploy({gasPrice:0});
            await c.deployed();
            return c;
        }else{
            return new Contract(addr, Exchange.interface, thiz.owner);
        }
    });
    console.log("Exchange deployed at:", this.Exchange.address);

    const StoredNFT = await ethers.getContractFactory("StoredNFT");
    await loadOrDeploy(this,"StoredNFT",true,async (thiz,addr)=>{
        if(addr==null){
            const c = await StoredNFT.deploy("a","b","c",{gasPrice:0});
            await c.deployed();
            await c.addMintRole(this.Exchange.address,{gasPrice:0});
            return c;
        }else{
            return new Contract(addr, StoredNFT.interface, thiz.owner);
        }
    });
    console.log("StoredNFT deployed at:", this.StoredNFT.address);
  });


  it("Exchange token",async function(){
    const tx = await this.Exchange.mint(this.StoredNFT.address, this.w1.address, {gasPrice:0});
    const res = await tx.wait();
    const tokenId = res.events[1].args["tokenId"];
    console.log("Exchange mint:", tokenId);

    const isOwner = await this.StoredNFT.verifyOwner(tokenId, this.w1.address);
    console.log(this.w1.address, 'is owner of', tokenId);
  });


  it("write addresses", async function(){
    writeFiles();
  });

});
