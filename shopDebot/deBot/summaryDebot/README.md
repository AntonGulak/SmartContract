И инструкция из видео:
Изменить содержимое summaryDebot.sol в соответствии с тем, как в начале видео
tondev sol compile shopList.sol
tonos-cli decode stateinit shopList.tvc --tvc
сохранить shopList.decode.json

tondev sol compile summaryDebot.sol
tonos-cli genaddr summaryDebot.tvc summaryDebot.abi.json --genkey summaryDebot.keys.json > log.log
Заполнить файл params.json
В моем случае:
{
    "dest": "0:2323e0a590844b13e6d45de747e4622e1bd6e29c0e967fc3351cfdd5775602a6",
    "amount": 10000000000
}
Закинуть денег
 
tonos-cli --url http://127.0.0.1 call --abi ../../libraries/local_giver.abi.json 0:841288ed3b55d9cdafa806807f02a0ae0c169aa5edfe88a789a6482429756a94 sendGrams params.json
Задеплоить
tonos-cli --url http://127.0.0.1 deploy summaryDebot.tvc "{}" --sign summaryDebot.keys.json --abi summaryDebot.abi.json
bash
cat summaryDebot.abi.json | xxd -p -c 20000
exit
Записать dabi.json - в моем случае:
{
    "dabi": "7b0d0a0........d0a7d0d0a"
}
Установить dabi
tonos-cli --url http://127.0.0.1 call 0:2323e0a590844b13e6d45de747e4622e1bd6e29c0e967fc3351cfdd5775602a6 setABI dabi.json --sign summaryDebot.keys.json --abi summaryDebot.abi.json
!!!!!!!!!
вызвать
tonos-cli --url http://127.0.0.1 run --abi summaryDebot.abi.json 0:2323e0a590844b13e6d45de747e4622e1bd6e29c0e967fc3351cfdd5775602a6 getDebotInfo "{}"
предварительно сформировать shopList.decode.json
tonos-cli --url http://127.0.0.1 call --abi summaryDebot.abi.json --sign summaryDebot.keys.json 0:2323e0a590844b13e6d45de747e4622e1bd6e29c0e967fc3351cfdd5775602a6 setTodoCode shopList.decode.json
Вызываем дебота
tonos-cli --url http://127.0.0.1 debot fetch 0:2323e0a590844b13e6d45de747e4622e1bd6e29c0e967fc3351cfdd5775602a6
Ошибка, которую можно получить, если не перейти на иную работу со stateInit как в лекции:
Debot error: Contract execution was terminated with error: Unknown error, exit code: 55 (Bad StateInit cell for tvm_insert_pubkey. Data was not found.)