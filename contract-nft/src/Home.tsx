import { WalletBalance } from './WalletBalance'
import { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import Sigils from '../artifacts/contracts/mynfty.sol/Sigils.json'

const contractAddress = 'YOUR_CONTRACT_ADDRESS'

const provider = new ethers.providers.Web3Provider(window.ethereum);

const signer = provider.getSigner();

const contract = new ethers.Contract(contractAddress, Sigils.abi, signer)

export function Home() {
  const [ totalMinted, setTotalMinted ] = useState(4);
  console.log(contract) 

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  }

  useEffect(() => {
    getCount();
  }, [])

  return (
    <div>
      <WalletBalance />

      {
        Array(totalMinted + 1)
        .fill(0)
        .map((_, i) => (
          <div key={1}>
            <NFTImage tokenId={i} getCount={getCount} />
          </div>
        ))
      }
    </div>
  )
}


function NFTImage({ tokenId, getCount}: any){
  const contentId = 'PINATA_CONTRACT_ID'
  const metadataURI = `${contentId}/${tokenId}.json`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`

  const [ isMinted, setIsMinted ] = useState(false);

  

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result)
    setIsMinted(result);
  }

  useEffect(() => {
    getMintedStatus();
  }, [isMinted])

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther('0.05'),
    });

    await result.wait();
    getMintedStatus();
    getCount();
  }

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    alert(uri);
  }

  return (
    <div >
      <img src={isMinted ? imageURI : 'img/placeholder.png'}/>
      <h5>ID #{tokenId}</h5>
      {!isMinted ? (
        <button onClick={mintToken}>
          Mint
        </button>
      ) : (
        <button onClick={getURI}>
          Taken! Show URI
        </button>
      )}
    </div>
  )
}