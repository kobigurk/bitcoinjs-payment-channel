var bitcoin = require('bitcoinjs-lib');

var Provider = (function () {
	function Provider(privateKey, fundAmount) {
		key = bitcoin.ECKey.fromWIF(privateKey);
		amount = fundAmount;
	}

	var key;
	var amount;

	var lastReceivedRefund;

	Provider.prototype.signRefund = function (incompleteTxHash) {
		var tx = bitcoin.Transaction.fromHex(incompleteTxHash);
		tx.sign(0, key);
		return (tx.build().toHex());
	};

	Provider.prototype.receiveRefund = function (incompleteTxHash) {
		lastReceivedRefund = incompleteTxHash;
		//perform verification
	};

}());

module.exports = Provider;
