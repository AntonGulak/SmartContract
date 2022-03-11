UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot?net=devnet&address=0:2845dfc5e221aa8c881eed09561533263ea3a390135108228beca1faa6732e59', "qr_link" = 'https://uri.ton.surf/debot?net=devnet&address=0:2845dfc5e221aa8c881eed09561533263ea3a390135108228beca1faa6732e59'
WHERE "type" = 'buy';

UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot?net=devnet&address=0:e30c94973d69f691068a807e1726fea702daa2918895d86faeb27aeeb91ccc71', "qr_link" = 'https://uri.ton.surf/debot?net=devnet&address=0:e30c94973d69f691068a807e1726fea702daa2918895d86faeb27aeeb91ccc71'
WHERE "type" = 'set auction';

UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot?net=devnet&address=0:5da153b7ad62372b5d7b38bf60abf9ed9196fafa605f3a4a7fcd2ec7c2b42a49', "qr_link" = 'https://uri.ton.surf/debot?net=devnet&address=0:5da153b7ad62372b5d7b38bf60abf9ed9196fafa605f3a4a7fcd2ec7c2b42a49'
WHERE "type" = 'offer';

UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot?net=devnet&address=0:e30c94973d69f691068a807e1726fea702daa2918895d86faeb27aeeb91ccc71', "qr_link" = 'https://uri.ton.surf/debot?net=devnet&address=0:e30c94973d69f691068a807e1726fea702daa2918895d86faeb27aeeb91ccc71'
WHERE "type" = 'stop auction';

UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot?net=devnet&address=0:d525a02811ab4412380f6edbae1d05134b8f2c9f17acdb6ac361676b078fa693', "qr_link" = 'https://uri.ton.surf/debot?net=devnet&address=0:d525a02811ab4412380f6edbae1d05134b8f2c9f17acdb6ac361676b078fa693'
WHERE "type" = 'stop direct sale';

UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot?net=devnet&address=0:d525a02811ab4412380f6edbae1d05134b8f2c9f17acdb6ac361676b078fa693', "qr_link" = 'https://uri.ton.surf/debot?net=devnet&address=0:d525a02811ab4412380f6edbae1d05134b8f2c9f17acdb6ac361676b078fa693'
WHERE "type" = 'set direct sale';
