import { useState } from "react";
import { useScaffoldReadContract } from "../hooks/scaffold-eth";

export default function PollResults() {
  const [pollId, setPollId] = useState<number>(-1);

  // Чтение результатов голосования
  const { data } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "getResults", // Функция для получения результатов
    args: [BigInt(pollId)], // Идентификатор голосования
  });

  return (
    <div className="max-w-lg w-full mx-auto mt-5 p-6 sm:p-8 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-xl shadow-xl">
      <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Результаты голосования</h3>
      <input
        type="number"
        placeholder="ID голосования"
        onChange={e => setPollId(e.target.value ? Number(e.target.value) : -1)}
        className="w-full p-3 mb-4 text-white bg-black bg-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
      />
      {data && (
        <div className="p-6 sm:p-8 bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded-xl shadow-lg mt-4">
          <ul className="space-y-2">
            {data[0].map((option: string, idx: number) => (
              <li key={idx} className="text-lg">
                <span className="font-semibold">{option}</span>: {Number(data[1][idx])} голосов
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
