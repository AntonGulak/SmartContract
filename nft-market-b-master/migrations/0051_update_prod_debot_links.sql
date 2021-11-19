UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot?address=0:d0656df4e036eb34a946d0de02babee93903c7262f079b7915cae6d9a42bf09e', "qr_link" = 'https://uri.ton.surf/debot?address=0:d0656df4e036eb34a946d0de02babee93903c7262f079b7915cae6d9a42bf09e'
WHERE "type" = 'buy' AND "env_type" = 'prod';

UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot?address=0:537829aeee38c18b98685672c1e011c491c3db1c28a2d6d47f5fbc3e40a2ac65', "qr_link" = 'https://uri.ton.surf/debot?address=0:537829aeee38c18b98685672c1e011c491c3db1c28a2d6d47f5fbc3e40a2ac65'
WHERE "type" = 'set auction' AND "env_type" = 'prod';

UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot?address=0:0575fc801e7a171a4b86e6d332264290fa0537d93cab73d8d8d36ae83719b6a2', "qr_link" = 'https://uri.ton.surf/debot?address=0:0575fc801e7a171a4b86e6d332264290fa0537d93cab73d8d8d36ae83719b6a2'
WHERE "type" = 'offer' AND "env_type" = 'prod';

UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot?address=0:0575fc801e7a171a4b86e6d332264290fa0537d93cab73d8d8d36ae83719b6a2', "qr_link" = 'https://uri.ton.surf/debot?address=0:0575fc801e7a171a4b86e6d332264290fa0537d93cab73d8d8d36ae83719b6a2'
WHERE "type" = 'stop auction' AND "env_type" = 'prod';

UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot?address=0:ada54884c69fa1596ffa6751b048e6ac529c35d7af41867f2a436d59d5233291', "qr_link" = 'https://uri.ton.surf/debot?address=0:ada54884c69fa1596ffa6751b048e6ac529c35d7af41867f2a436d59d5233291'
WHERE "type" = 'stop direct sale' AND "env_type" = 'prod';

UPDATE "debot_link"
SET "link" = 'https://uri.ton.surf/debot?address=0:ada54884c69fa1596ffa6751b048e6ac529c35d7af41867f2a436d59d5233291', "qr_link" = 'https://uri.ton.surf/debot?address=0:ada54884c69fa1596ffa6751b048e6ac529c35d7af41867f2a436d59d5233291'
WHERE "type" = 'set direct sale' AND "env_type" = 'prod';