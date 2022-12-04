import config from 'config';
import Web3 from 'web3';

const getWeb3NoAccount = () => {
  const httpProvider = new Web3.providers.HttpProvider(config.rpcUrl!, {
    timeout: 10000,
  });
  const web3NoAccount = new Web3(httpProvider);
  return web3NoAccount;
};

export default getWeb3NoAccount;
