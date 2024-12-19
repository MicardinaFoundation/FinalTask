import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function EndPoll({ pollId }: { pollId: bigint }) {
  // Хук для записи данных в смарт-контракт
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract", // Имя контракта
  });

  // Функция для завершения голосования
  const handleEndPoll = async () => {
    try {


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
    <div className="flex flex-row p-2 text-black  mt-1 mr-2">
      
      <h3 className="text-xl mb-2 mt-3 align-middle font-medium">Закончить голосование?</h3>
      <button
        onClick={handleEndPoll} // Завершаем голосование при клике
        disabled={isMining} // Отключаем кнопку, если процесс в ожидании
        className={`mb-2 ml-2 mt-2 px-4 text-white rounded-lg ${isMining ? "bg-gray-500" : "bg-red-700 hover:bg-red-800"}`}
      >
        {isMining ? "Завершение..." : "Завершить"}
      </button>

    </div>
  );
}
