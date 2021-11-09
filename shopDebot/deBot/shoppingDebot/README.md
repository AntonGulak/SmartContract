И инструкция из видео:
Изменить содержимое shoppingDebot.sol в соответствии с тем, как в начале видео
tondev sol compile shopList.sol
tonos-cli decode stateinit shopList.tvc --tvc
сохранить shopList.decode.json

tondev sol compile shoppingDebot.sol
tonos-cli genaddr shoppingDebot.tvc shoppingDebot.abi.json --genkey shoppingDebot.keys.json > log.log
Заполнить файл params.json
В моем случае:
{
    "dest": "0:d3675530f5493c5667e72957e658faaf1ce393ef28dfd958e277209f0018bbf5",
    "amount": 10000000000
}
Закинуть денег
 
tonos-cli --url http://127.0.0.1 call --abi ../../libraries/local_giver.abi.json 0:841288ed3b55d9cdafa806807f02a0ae0c169aa5edfe88a789a6482429756a94 sendGrams params.json
Задеплоить
tonos-cli --url http://127.0.0.1 deploy shoppingDebot.tvc "{}" --sign shoppingDebot.keys.json --abi shoppingDebot.abi.json
bash
cat shoppingDebot.abi.json | xxd -p -c 20000
exit
Записать dabi.json - в моем случае:
{
    "dabi": "7b0d0a0........d0a7d0d0a"
}
Установить dabi
tonos-cli --url http://127.0.0.1 call 0:d3675530f5493c5667e72957e658faaf1ce393ef28dfd958e277209f0018bbf5 setABI dabi.json --sign shoppingDebot.keys.json --abi shoppingDebot.abi.json
!!!!!!!!!
вызвать
tonos-cli --url http://127.0.0.1 run --abi shoppingDebot.abi.json 0:d3675530f5493c5667e72957e658faaf1ce393ef28dfd958e277209f0018bbf5 getDebotInfo "{}"
предварительно сформировать shopList.decode.json
tonos-cli --url http://127.0.0.1 call --abi shoppingDebot.abi.json --sign shoppingDebot.keys.json 0:d3675530f5493c5667e72957e658faaf1ce393ef28dfd958e277209f0018bbf5 setTodoCode shopList.decode.json
Вызываем дебота
tonos-cli --url http://127.0.0.1 debot fetch 0:d3675530f5493c5667e72957e658faaf1ce393ef28dfd958e277209f0018bbf5
Ошибка, которую можно получить, если не перейти на иную работу со stateInit как в лекции:
Debot error: Contract execution was terminated with error: Unknown error, exit code: 55 (Bad StateInit cell for tvm_insert_pubkey. Data was not found.)