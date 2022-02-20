import { useState } from 'react';
import { ethers } from 'ethers';


export function WalletBalance() {
  const [balance, setBalance] = useState() as any;
  
  
  const getBalance = async() => {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts'});
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  };

  return (
    <div>
      <h5>Your Balance: {balance}</h5>
      <button onClick={() => getBalance()}>Show my Balance</button>
    </div>
  )

}