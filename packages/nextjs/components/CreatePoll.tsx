import { useState } from "react";
import { useScaffoldWriteContract } from "../hooks/scaffold-eth";

export default function CreatePoll() {
  // Состояния для хранения данных о вопросе, вариантах ответов и длительности
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);

  // Хук для записи данных в смарт-контракт
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract", // Имя контракта
  });

  // Функция для добавления нового варианта ответа
  const addOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, optionInput.trim()]); // Добавляем новый вариант в массив
      setOptionInput(""); // Очищаем поле ввода
    }
  };

  // Функция для создания голосования
  const createPoll = async () => {
    if (question && options.length > 1 && duration > 0) {
      // Выполняем транзакцию на создание голосования
      await writeContractAsync({
        functionName: "createPoll", // Имя функции контракта для создания голосования
        args: [question, options, BigInt(duration)], // Аргументы: вопрос, варианты ответов и длительность в секундах
      });
    } else {
      alert("Пожалуйста, заполните все поля корректно."); // Если поля не заполнены правильно
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto p-6 sm:p-8 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-xl shadow-xl">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Создать голосование</h2>
      <input
        type="text"
        placeholder="Вопрос голосования"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        className="w-full p-3 mb-4 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
      />
      <div className="flex flex-col sm:flex-row items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Добавить вариант ответа"
          value={optionInput}
          onChange={e => setOptionInput(e.target.value)}
          className="flex-1 p-3 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          onClick={addOption}
          className="mt-2 sm:mt-0 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Добавить вариант
        </button>
      </div>
      <ul className="mb-4 list-disc list-inside space-y-1">
        {options.map((opt, idx) => (
          <li key={idx} className="text-lg">
            {opt}
          </li>
        ))}
      </ul>
      <input
        type="number"
        placeholder="Длительность (в секундах)"
        value={duration}
        onChange={e => setDuration(Number(e.target.value))}
        className="w-full p-3 mb-4 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
      />
      <button
        onClick={createPoll}
        disabled={isMining}
        className={`w-full py-3 rounded-md text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 ${
          isMining ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isMining ? "Создание..." : "Создать голосование"}
      </button>
    </div>
  );
}
