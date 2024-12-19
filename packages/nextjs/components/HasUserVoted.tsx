import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function HasUserVoted({ pollId }: { pollId: bigint }) {
  const [userAddress, setUserAddress] = useState<string>("");

  const { data: hasVoted } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "hasUserVoted", // Функция для проверки, проголосовал ли пользователь
    args: [pollId, userAddress], 
  });

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  if (hasVoted === undefined) return <p>Загрузка...</p>;

  return (
    <div className="p-1 bg-gray-500 text-white rounded-lg shadow-md mt-2">
      {hasVoted ? (
        <p className="text-xl text-lime-300 font-semibold">Голос отдан</p> 
      ) : (
        <p className="text-xl text-red-400 font-semibold">Голос не отдан</p>
      )}
    </div>
  );
}
