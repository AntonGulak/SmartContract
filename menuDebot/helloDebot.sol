pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;
// import required DeBot interfaces and basic DeBot contract.
import "../base/Debot.sol";
import "../base/Terminal.sol";
import "../base/Menu.sol";

contract HelloDebot is Debot {
    bytes m_icon;

    function setIcon(bytes icon) public {
        require(msg.pubkey() == tvm.pubkey(), 100);
        tvm.accept();
        m_icon = icon;
    }

    /// @notice Entry point function for DeBot.
    function start() public override {
        // print string to user.
        Terminal.print(0, "Hello, World!");
        _menu();  
    }

    function _menu() private inline {
        Menu.select("Main menu", "How do you fell today?" , [
            MenuItem("I'm fine :)", "", tvm.functionId(handleMenu1)),
            MenuItem("I'm not OK", "o_0", tvm.functionId(handleMenu2))
        ]);
    }

    function handleMenu1(uint32 index) public {
        Terminal.print(0, "Have a good day");
    }

    function handleMenu2(uint32 index) public {
        Terminal.print(0, "This is a wrong answer, try again =)!");
        _menu();
    }

    /// @notice Returns Metadata about DeBot.
    function getDebotInfo() public functionID(0xDEB) override view returns(
        string name, string version, string publisher, string caption, string author,
        address support, string hello, string language, string dabi, bytes icon
    ) {
        name = "HelloWorld";
        version = "0.2.0";
        publisher = "TON Labs";
        caption = "Start develop DeBot from here";
        author = "TON Labs";
        support = address.makeAddrStd(0, 0x841288ed3b55d9cdafa806807f02a0ae0c169aa5edfe88a789a6482429756a94);
        hello = "Hello, i am a HelloWorld 2.0 DeBot.";
        language = "en";
        dabi = m_debotAbi.get();
        icon = m_icon;
    }

    function getRequiredInterfaces() public view override returns (uint256[] interfaces) {
        return [ Terminal.ID ];
    }

    function setUserInput(string value) public {
        // TODO: continue DeBot logic here...
        Terminal.print(0, format("You have entered \"{}\"", value));
    }

}