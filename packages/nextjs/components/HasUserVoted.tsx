import { useEffect, useState } from "react";
import { useScaffoldReadContract } from "../hooks/scaffold-eth";
import { useAccount } from "wagmi";

export default function HasUserVoted({ pollId }: { pollId: bigint }) {
  const [userAddress, setUserAddress] = useState<string>("");

  // Хук для чтения данных о том, проголосовал ли пользователь
  const { data: hasVoted } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "hasUserVoted", // Функция для проверки, проголосовал ли пользователь
    args: [pollId, userAddress], // Аргументы: идентификатор голосования и адрес пользователя
  });

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  if (hasVoted === undefined) return <p>Загрузка...</p>; // Пока данные не загружены, показываем индикатор

  return (
    <div className="max-w-md w-full mx-auto p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg mt-4 text-center">
      {hasVoted ? (
        <p className="text-xl font-semibold">Вы уже проголосовали в этом голосовании.</p>
      ) : (
        <p className="text-xl font-semibold">Вы ещё не проголосовали в этом голосовании.</p>
      )}
    </div>
  );
}
