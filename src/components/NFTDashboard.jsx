import { useEffect, useState } from 'react';
import { useConnect, useAccount } from 'wagmi';

const CONTRACT_ADDRESS = '0x28D744dAb5804eF913dF1BF361E06Ef87eE7FA47';
const ALCHEMY_API_KEY = 'https://base-mainnet.g.alchemy.com/v2/-h4g9_mFsBgnf1Wqb3aC7Qj06rOkzW-m';

export default function NFTDashboard() {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNFTs = async () => {
    setLoading(true);
    try {
      const url = `${ALCHEMY_API_KEY}/getNFTsForOwner?owner=${address}&contractAddresses[]=${CONTRACT_ADDRESS}&withMetadata=true`;
      const res = await fetch(url);
      const data = await res.json();
      const nftList = (data.ownedNfts || [])
        .filter(n => n.metadata && typeof n.metadata.image === 'string')
        .map(n => {
          const metadata = n.metadata;
          const raw = metadata.image;
          const img = raw.startsWith('ipfs://')
            ? raw.replace('ipfs://', 'https://ipfs.io/ipfs/')
            : raw;
          return {
            tokenId: n.tokenId.startsWith('0x') ? parseInt(n.tokenId, 16).toString() : n.tokenId,
            name: metadata.name,
            description: metadata.description,
            image: img,
          };
        });
      setNfts(nftList);
    } catch (err) {
      console.error('Failed to fetch NFTs', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isConnected) loadNFTs();
  }, [isConnected]);

  if (!isConnected) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Connect your wallet</h1>
        {connectors.map(c => (
          <button
            key={c.id}
            onClick={() => connect({ connector: c })}
            disabled={!c.ready}
            className="bg-black text-white p-2 m-1 rounded"
          >
            {isLoading && pendingConnector?.id === c.id
              ? 'Connecting...'
              : `Connect with ${c.name}`}
          </button>
        ))}
        {error && <div className="text-red-600">{error.message}</div>}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ReVerse Genesis NFT Dashboard</h1>
      {loading ? (
        <p>Loading NFTs...</p>
      ) : nfts.length === 0 ? (
        <p>No NFTs found in this wallet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {nfts.map(nft => (
            <div key={nft.tokenId} className="border rounded p-4 shadow">
              <img src={nft.image} alt={nft.name} className="mb-2 w-full" />
              <h2 className="text-lg font-semibold">
                #{nft.tokenId} — {nft.name}
              </h2>
              <p className="text-sm text-gray-600">{nft.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
