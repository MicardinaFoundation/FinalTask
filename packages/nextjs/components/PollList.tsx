import EndPoll from "~~/components/EndPoll";
import HasUserVoted from "~~/components/HasUserVoted";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function PollList() {
  // Чтение количества существующих голосований
  const { data: pollCount } = useScaffoldReadContract({
    contractName: "VotingContract", // Имя контракта
    functionName: "getPollCount", // Имя функции для получения количества голосований
  });

  // Рендер списка голосований
  const renderPolls = () => {
    if (!pollCount) return <p>Загрузка...</p>; 
    const polls = [];
    for (let i: number = 0; i < pollCount; i++) {
      polls.push(<PollItem key={i} pollId={BigInt(i)} />); // Генерируем компоненты для каждого голосования
    }
    return polls;
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-500 to-lime-500 text-white rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Список голосований</h2>
      <div className="flex">
        {pollCount && pollCount > 0 ? renderPolls() : <p className="text-xl">Активных голосований нет</p>}
        {/*Если голосования есть, показываем их*/}

      </div>
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
    <div className="bg-white p-4 px-6 rounded-lg shadow-md mb-4 mr-4">
      <h3 className="text-xl font-semibold text-black">{question}</h3>
      <ul className="mt-1 mb-4">
        {options.map((opt: string, idx: number) => (
          <li key={idx} className="flex justify-between items-center">
            <span className="text-black">{opt}</span>
            {isActive && (
              <button
                onClick={() =>
                  writeContractAsync({
                    functionName: "vote", // Функция для голосования
                    args: [BigInt(pollId), BigInt(idx)], // По умолчанию голосуем за первый вариант
                  })
                } // Отправка голоса
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 my-1"
              >
                Голосовать
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="flex">
      {!isActive && <p className="text-red-500 py-3 pr-2">Голосование завершено</p>}
      {/*Показываем сообщение, если голосование завершено*/}
      {isActive && <EndPoll pollId={pollId} />}
      {/* Отображаем кнопку для завершения голосования, если оно активно */}
      <HasUserVoted pollId={pollId} />
      {/* Статус голосования пользователя */}

      </div>
    </div>
  );
}
