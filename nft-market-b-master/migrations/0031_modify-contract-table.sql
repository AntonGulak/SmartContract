ALTER TABLE contract RENAME COLUMN code_hash TO tvc_base64;
ALTER TABLE contract ADD COLUMN code_hash varchar;
