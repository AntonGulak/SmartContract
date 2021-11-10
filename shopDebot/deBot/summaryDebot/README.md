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
    "dest": "0:3a71c3e1d03a1119f2464fe03d600a0cbac6b87b25cd8f7ee5e03fb7adbbc64f",
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
tonos-cli --url http://127.0.0.1 call 0:3a71c3e1d03a1119f2464fe03d600a0cbac6b87b25cd8f7ee5e03fb7adbbc64f setABI dabi.json --sign summaryDebot.keys.json --abi summaryDebot.abi.json
!!!!!!!!!
вызвать
tonos-cli --url http://127.0.0.1 run --abi summaryDebot.abi.json 0:3a71c3e1d03a1119f2464fe03d600a0cbac6b87b25cd8f7ee5e03fb7adbbc64f getDebotInfo "{}"
предварительно сформировать shopList.decode.json
tonos-cli --url http://127.0.0.1 call --abi summaryDebot.abi.json --sign summaryDebot.keys.json 0:3a71c3e1d03a1119f2464fe03d600a0cbac6b87b25cd8f7ee5e03fb7adbbc64f setShopList shopList.decode.json
Вызываем дебота
tonos-cli --url http://127.0.0.1 debot fetch 0:3a71c3e1d03a1119f2464fe03d600a0cbac6b87b25cd8f7ee5e03fb7adbbc64f
Ошибка, которую можно получить, если не перейти на иную работу со stateInit как в лекции:
Debot error: Contract execution was terminated with error: Unknown error, exit code: 55 (Bad StateInit cell for tvm_insert_pubkey. Data was not found.)