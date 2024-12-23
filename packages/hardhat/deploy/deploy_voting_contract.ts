import { HardhatRuntimeEnvironment } from "hardhat/types"; // Импорт типов для среды выполнения Hardhat
import { DeployFunction } from "hardhat-deploy/types"; // Импорт типа функции деплоя
import { VotingContract } from "../typechain-types"; // Импорт типов сгенерированного контракта

/**
 * Скрипт для деплоя смарт-контракта VotingContract.
 * Использует Hardhat Runtime Environment для доступа к необходимым функциям и данным.
 *
 * @param hre Объект среды выполнения Hardhat.
 */
const deployVotingContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Развертывание контракта VotingContract
  await deploy("VotingContract", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const votingContract = await hre.ethers.getContract<VotingContract>("VotingContract", deployer);

  console.log("👋 Initial greeting:", await votingContract.greeting());
};

export default deployVotingContract;

deployVotingContract.tags = ["VotingContract"];
