И инструкция из видео:
Изменить содержимое fillShipListDebot.sol в соответствии с тем, как в начале видео
tondev sol compile shopList.sol
tonos-cli decode stateinit shopList.tvc --tvc
сохранить shopList.decode.json

tondev sol compile fillShipListDebot.sol
tonos-cli genaddr fillShipListDebot.tvc fillShipListDebot.abi.json --genkey fillShipListDebot.keys.json > log.log
Заполнить файл params.json
В моем случае:
{
    "dest": "0:8015d4b0fa47c67ea0219fbe87846e837713d35de8579d8256b6c009c2b06fcf",
    "amount": 10000000000
}
Закинуть денег
 
tonos-cli --url http://127.0.0.1 call --abi ../../libraries/local_giver.abi.json 0:841288ed3b55d9cdafa806807f02a0ae0c169aa5edfe88a789a6482429756a94 sendGrams params.json
Задеплоить
tonos-cli --url http://127.0.0.1 deploy fillShipListDebot.tvc "{}" --sign fillShipListDebot.keys.json --abi fillShipListDebot.abi.json
bash
cat fillShipListDebot.abi.json | xxd -p -c 20000
exit
Записать dabi.json - в моем случае:
{
    "dabi": "7b0d0a0........d0a7d0d0a"
}
Установить dabi
tonos-cli --url http://127.0.0.1 call 0:8015d4b0fa47c67ea0219fbe87846e837713d35de8579d8256b6c009c2b06fcf setABI dabi.json --sign fillShipListDebot.keys.json --abi fillShipListDebot.abi.json
!!!!!!!!!
вызвать
tonos-cli --url http://127.0.0.1 run --abi fillShipListDebot.abi.json 0:8015d4b0fa47c67ea0219fbe87846e837713d35de8579d8256b6c009c2b06fcf getDebotInfo "{}"
предварительно сформировать shopList.decode.json
tonos-cli --url http://127.0.0.1 call --abi fillShipListDebot.abi.json --sign fillShipListDebot.keys.json 0:8015d4b0fa47c67ea0219fbe87846e837713d35de8579d8256b6c009c2b06fcf setTodoCode shopList.decode.json
Вызываем дебота
tonos-cli --url http://127.0.0.1 debot fetch 0:8015d4b0fa47c67ea0219fbe87846e837713d35de8579d8256b6c009c2b06fcf
Ошибка, которую можно получить, если не перейти на иную работу со stateInit как в лекции:
Debot error: Contract execution was terminated with error: Unknown error, exit code: 55 (Bad StateInit cell for tvm_insert_pubkey. Data was not found.)