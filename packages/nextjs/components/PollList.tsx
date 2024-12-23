import { useScaffoldReadContract, useScaffoldWriteContract } from "../hooks/scaffold-eth";
import EndPoll from "~~/components/EndPoll";
import HasUserVoted from "~~/components/HasUserVoted";

export default function PollList() {
  // Чтение количества существующих голосований
  const { data: pollCount } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "getPollCount", // Имя функции для получения количества голосований
  });

  // Функция для рендеринга списка голосований
  const renderPolls = () => {
    if (!pollCount) return <p>Загрузка...</p>; // Пока данные не загружены, показываем индикатор загрузки
    const polls = [];
    for (let i: number = 0; i < pollCount; i++) {
      polls.push(<PollItem key={i} pollId={BigInt(i)} />); // Генерируем компоненты для каждого голосования
    }
    return polls;
  };

  return (
    <div className="max-w-lg w-full mt-5 mx-auto p-6 sm:p-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-xl">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Список голосований</h2>
      {pollCount && pollCount > 0 ? renderPolls() : <p className="text-xl text-center">Нет активных голосований</p>}
    </div>
  );
}

// Компонент для каждого отдельного голосования
function PollItem({ pollId }: { pollId: bigint }) {
  const { data } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "getPollDetails", // Функция для получения данных голосования
    args: [BigInt(pollId)], // Идентификатор голосования
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "VotingContract", // Имя контракта
  });

  if (!data) return <p>Загрузка...</p>; // Пока данные не загружены, показываем индикатор

  const [question, options, , isActive] = data; // Получаем вопрос, варианты ответов и статус голосования
  return (
    <div className="max-w-xl w-full mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg mb-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{question}</h3>
      <ul className="space-y-2 mb-4">
        {options.map((opt: string, idx: number) => (
          <li key={idx} className="flex justify-between items-center">
            <span className="text-gray-700">{opt}</span>
            {isActive && (
              <button
                onClick={() =>
                  writeContractAsync({
                    functionName: "vote", // Функция для голосования
                    args: [BigInt(pollId), BigInt(idx)],
                  })
                }
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Голосовать
              </button>
            )}
          </li>
        ))}
      </ul>
      {!isActive && <p className="text-red-500 mb-4">Голосование завершено</p>}
      {isActive && <EndPoll pollId={pollId} />}
      <HasUserVoted pollId={pollId} />
    </div>
  );
}
