const {TonClient} = require("@tonclient/core");
const {libNode} = require("@tonclient/lib-node");

// Application initialization

TonClient.useBinaryLibrary(libNode)