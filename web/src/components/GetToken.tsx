import { Contract } from "ethers";
import { toast } from "react-toastify";

import { TOKEN_ABI, TOKEN_ADDRESS } from "@/helpers/constants";
import { getProviderOrSigner } from "@/helpers/walletProvider";

interface GetTokenProps {
  web3ModalRef: any;
}
const GetToken = ({ web3ModalRef }: GetTokenProps) => {
  const defaultTokenValue = 200;

  const getToken = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const signer = await getProviderOrSigner(true, web3ModalRef);

        const tokenContract = new Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);

        await tokenContract.getToken(defaultTokenValue);

        toast(`You won ${defaultTokenValue} tokens`, {
          hideProgressBar: true,
          autoClose: 4000,
          type: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      className="p-4 bg-green-700 text-md border rounded-xl text-white cursor-pointer"
      onClick={getToken}
    >
      Get DAO token
    </button>
  );
};

export default GetToken;
