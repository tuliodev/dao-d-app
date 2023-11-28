import { providers } from "ethers";
import { toast } from "react-toastify";

export const getProviderOrSigner = async (
  needSigner = false,
  web3ModalRef: any,
) => {
  const provider = await web3ModalRef.current.connect();
  const web3Provider = new providers.Web3Provider(provider);

  const { chainId } = await web3Provider.getNetwork();

  if (chainId !== 11155111) {
    toast(`Change the network to Sepolia`, {
      hideProgressBar: true,
      autoClose: 4000,
      type: "error",
    });
    throw new Error("Change the network to Sepolia");
  }

  if (needSigner) {
    const signer = web3Provider.getSigner();

    return signer;
  }
  return web3Provider;
};
