import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import 'dotenv/config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers } = hre;

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

  if (addresses['Exchange']==null) {
    const Exchange = await ethers.getContractFactory("Exchange");
    const exchange = await Exchange.deploy({gasPrice:0});
    await exchange.deployed();
    addresses['Exchange'] = exchange.address;

    writeFiles();
  }
};

func.tags = ["Exchange"];
// func.dependencies = [""];

export default func;
