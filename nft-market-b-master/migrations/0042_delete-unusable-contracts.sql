DELETE FROM contract WHERE version IS NULL AND type <> 'SafeMultisigWallet';
