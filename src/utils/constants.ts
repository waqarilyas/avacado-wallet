import {ethers} from 'ethers'; // ethers@v5
import avoForwarderV1ABI from './avo-forwarder-v1-abi.json';
import avoV1ABI from './avo-forwarder-v1-abi.json';

const forwarderABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner_',
        type: 'address'
      },
      {
        internalType: 'uint32',
        name: 'index_',
        type: 'uint32'
      }
    ],
    name: 'computeAvocado',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

const avocadoProvider = new ethers.JsonRpcProvider(
  'https://rpc.avocado.instadapp.io'
);
// can use any other RPC on the network you want to interact with:
const polygonProvider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

const signer = avocadoProvider.getSigner();

const avoForwarderAddress = '0x46978CD477A496028A18c02F07ab7F35EDBa5A54'; // available on 10+ networks

// set up AvoForwarder contract (main interaction point) on e.g. Polygon
const forwarder = new ethers.Contract(
  avoForwarderAddress,
  forwarderABI,
  polygonProvider
);

export {
  forwarder,
  avocadoProvider,
  polygonProvider,
  signer,
  avoForwarderV1ABI,
  avoV1ABI
};
