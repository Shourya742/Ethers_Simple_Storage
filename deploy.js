const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()
async function main() {
    // Compile them in our code
    // Compile them seperately

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying")
    const contract = await contractFactory.deploy()
    const transactionReceipt = await contract.deployTransaction.wait(1)
    //   console.log("here is the deployent transaction: ");
    //   console.log(contract.deployTransaction);
    //   console.log("Here is the transaction receipt: ");
    //   console.log(transactionReceipt);
    console.log("Deployed")

    //   console.log("Let' s deploy with only transaction data!!");
    //   const nonce = await wallet.getTransactionCount();
    //   const tx = {
    //     nonce: nonce,
    //     gasPrice: 2000000000,
    //     gasLimit: 10000000,
    //     to: null,
    //     value: 0,
    //     data: "0xBinaryData",
    //     chainId: 1337,
    //   };
    //   //   const signedTxResponse = await wallet.signTransaction(tx);
    //   //   console.log(signedTxResponse);
    //   const sendTxResponse = await wallet.sendTransaction(tx);
    //   console.log(sendTxResponse);

    const currentFavoriteNumber = await contract.retrieve()
    console.log(
        `This is the current favorite number: ${currentFavoriteNumber.toString()}`
    )
    const transactionResponse = await contract.store("7")
    const transactionReceipt1 = await transactionResponse.wait(1)
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(`Updated number : ${updatedFavoriteNumber}`)
}
main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
