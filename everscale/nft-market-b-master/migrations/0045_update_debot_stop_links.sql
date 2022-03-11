UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot/0:41d7e9c7c6b7b5931335362d25efbc255935aa17fc2e6f0ca4061b3417442388?net=devnet', "qr_link" = 'https://uri.ton.surf/debot/0:41d7e9c7c6b7b5931335362d25efbc255935aa17fc2e6f0ca4061b3417442388?net=devnet'
WHERE "type" = 'stop auction';

UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot/0:2c4bb9bc4a6e7e6b898fcffdb4830ce4b543dec33411b6e5011e52c9226998f3?net=devnet', "qr_link" = 'https://uri.ton.surf/debot/0:2c4bb9bc4a6e7e6b898fcffdb4830ce4b543dec33411b6e5011e52c9226998f3?net=devnet'
WHERE "type" = 'stop direct sale';