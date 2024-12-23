import { useScaffoldWriteContract } from "../hooks/scaffold-eth";

export default function EndPoll({ pollId }: { pollId: bigint }) {
  // Хук для записи данных в смарт-контракт
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract", // Имя контракта
  });

  // Функция для завершения голосования
  const handleEndPoll = async () => {
    try {
      // Выполняем транзакцию на завершение голосования
      await writeContractAsync({
        functionName: "endPoll", // Имя функции контракта для завершения голосования
        args: [pollId], // Аргумент: идентификатор голосования
      });
      alert("Голосование завершено!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при завершении голосования.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 sm:p-8 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg mt-4">
      <h3 className="text-2xl font-bold mb-4 text-center">Завершить голосование</h3>
      <p className="text-lg text-center mb-6">Вы уверены, что хотите завершить голосование?</p>
      <button
        onClick={handleEndPoll} // Завершаем голосование при клике
        disabled={isMining} // Отключаем кнопку, если процесс в ожидании
        className={`w-full py-3 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-red-300 ${
          isMining ? "bg-gray-500" : "bg-red-700 hover:bg-red-800"
        }`}
      >
        {isMining ? "Завершение..." : "Завершить голосование"}
      </button>
    </div>
  );
}
