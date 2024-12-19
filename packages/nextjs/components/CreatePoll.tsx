import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreatePoll() {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract", // Имя контракта
  });

  const addOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, optionInput.trim()]); // Добавляем новый вариант в массив
      setOptionInput(""); // Очищаем поле ввода
    }
  };

  const createPoll = async () => {
    if (question && options.length > 1 && duration > 0) {
      // Выполняем транзакцию на создание голосования
      await writeContractAsync({


        functionName: "createPoll", // Имя функции контракта для создания голосования
        args: [question, options, BigInt(duration)], // Аргументы: вопрос, варианты ответов и длительность в секундах
      });
    } else {
      alert("Заполните поля правильно."); // Если поля не заполнены правильно
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-white rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Создать голосование</h2>
      <p className="font-medium mb-1">Вопрос для голосования</p>
      <input
        type="text"
        placeholder="Введите текст (название для голосования)"
        value={question}
        onChange={e => setQuestion(e.target.value)} // Обновляем состояние вопроса
        className="w-full p-2 text-white rounded-lg"
      />
      <p className="font-medium mb-1">Ответ:</p>
      <div className="flex items-center mb-4">
      
        <input
          type="text"
          placeholder="Написать вариант ответа"
          value={optionInput}
          onChange={e => setOptionInput(e.target.value)} // Обновляем состояние для нового варианта
          className="flex-1 p-2 mr-2 text-white rounded-lg"
        />
        <button
          onClick={addOption} // Добавление варианта при клике


          className="text-white px-4 py-2 rounded-lg bg-indigo-400 hover:bg-indigo-600"
        >

          Добавить вариант
        </button>
      </div>
      <ul className="mb-4">
        {options.map((opt, idx) => (
          <li key={idx} className="text-lg">
            {opt}
          </li> // Выводим добавленные варианты
        ))}
      </ul>
      <p className="font-medium mb-1">Длительность голосования в секундах</p>
      <input
        type="number"
        placeholder="Длительность (в секундах)"
        value={duration}
        onChange={e => setDuration(Number(e.target.value))} // Обновляем длительность голосования
        className="w-full p-2 mb-1 text-white rounded-lg"
      />
      <button
        onClick={createPoll} // Запуск создания голосования
        disabled={isMining} // Отключаем кнопку, если процесс в ожидании
        className={`w-full mt-4 py-2 rounded-lg text-white ${isMining ? "bg-gray-500" : "bg-indigo-400 hover:bg-indigo-600"}`}
      >
        {isMining ? "Создание..." : "Создать голосование"} {/*Текст на кнопке зависит от состояния загрузки*/}
      </button>
    </div>
  );
}
