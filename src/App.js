import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import PropertyOwnershipRegistryABI from './abis/PropertyOwnershipRegistry.json';

const propertyRegistryAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [propertyName, setPropertyName] = useState('');
  const [propertyPrice, setPropertyPrice] = useState('');
  const [propertyCount, setPropertyCount] = useState(0);
  const [properties, setProperties] = useState([]);
  const [propertyAddress, setPropertyAddress] = useState('');
  const [newOwnerAddress, setNewOwnerAddress] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const signer = provider.getSigner();
        setSigner(signer);
        const contract = new ethers.Contract(propertyRegistryAddress, PropertyOwnershipRegistryABI, signer);
        setContract(contract);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const propertyCount = await contract.getPropertyCount();
        setPropertyCount(propertyCount.toNumber());
        fetchProperties(contract, propertyCount);
      } else {
        console.error('Ethereum object not found');
      }
    };
    init();
  }, []);

  const fetchProperties = async (contract, count) => {
    let propertiesArray = [];
    for (let i = 0; i < count; i++) {
      const property = await contract.getPropertyInfo(i);
      propertiesArray.push({
        name: property[0],
        price: ethers.utils.formatEther(property[1]),
        address: property[2],
        owner: property[3],
      });
    }
    setProperties(propertiesArray);
  };

  const registerProperty = async () => {
    if (!propertyName || !propertyPrice) {
      alert('Please provide property name and price.');
      return;
    }
    try {
      const tx = await contract.registerProperty(propertyName, ethers.utils.parseEther(propertyPrice));
      await tx.wait();
      const propertyCount = await contract.getPropertyCount();
      setPropertyCount(propertyCount.toNumber());
      fetchProperties(contract, propertyCount);
    } catch (error) {
      console.error('Error registering property:', error);
    }
  };

  const connectToMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      console.log('Connected Account:', accounts[0]);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  const fetchPropertyCount = async () => {
    try {
      const count = await contract.getPropertyCount();
      setPropertyCount(count.toNumber());
      console.log('Property Count:', count.toNumber());
    } catch (error) {
      console.error('Error fetching property count:', error);
    }
  };

  const transferProperty = async () => {
    if (!propertyAddress || !newOwnerAddress) {
      alert('Please provide both property address and new owner address.');
      return;
    }
    try {
      const currentOwner = await contract.propertyToOwner(propertyAddress);
      if (currentOwner.toLowerCase() !== account.toLowerCase()) {
        console.log(currentOwner)
        console.log(account)
        alert('You are not the owner of this property.');
        return;
      }
      const tx = await contract.transferPropertyOwnership(propertyAddress, newOwnerAddress);
      const propertiesArray = []
      for (let i = 0; i < propertyCount; i++) {
        if(properties[i] === propertyAddress){
          const property = await contract.getPropertyInfo(i);
          propertiesArray.push({
          name: property[0],
          price: ethers.utils.formatEther(property[1]),
          address: property[2],
          owner: newOwnerAddress,
        });
        }
        else{
        const property = await contract.getPropertyInfo(i);
        propertiesArray.push({
          name: property[0],
          price: ethers.utils.formatEther(property[1]),
          address: property[2],
          owner: property[3],
        });
      }
      }
      setProperties(propertiesArray);
      await tx.wait();
      console.log('Property transfer successful');
    } catch (error) {
      console.error('Error transferring property:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Property Registry</h1>
        <div>
          {account ? (
            <p>Connected Account: {account}</p>
          ) : (
            <button onClick={connectToMetaMask}>Connect to MetaMask</button>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Property Name"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Property Price (in ETH)"
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(e.target.value)}
          />
          <button onClick={registerProperty}>Register Property</button>
        </div>
        <h2>Registered Properties</h2>
        <div>
          <button onClick={fetchPropertyCount}>Fetch Property Count</button>
          {propertyCount !== null && (
            <p>Total Properties: {propertyCount}</p>
          )}
        </div>
        <ul>
          {properties.map((property, index) => (
            <li key={index}>
              <strong>Name:</strong> {property.name} <br />
              <strong>Price:</strong> {property.price} ETH <br />
              <strong>Address:</strong> {property.address} <br />
              <strong>Owner:</strong> {property.owner} <br />
            </li>
          ))}
        </ul>
        <div>
          <h2>Transfer Property Ownership</h2>
          <label>
            Property Address:
            <input
              type="text"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
            />
          </label>
          <br />
          <label>
            New Owner Address:
            <input
              type="text"
              value={newOwnerAddress}
              onChange={(e) => setNewOwnerAddress(e.target.value)}
            />
          </label>
          <br />
          <button onClick={transferProperty}>Transfer Property</button>
        </div>
      </header>
    </div>
  );
}

export default App;