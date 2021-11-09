pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

abstract contract get {
   
    uint32 m_count;

  
    function getStat() public view returns (uint32 count) {
        count = m_count;
    }
}

