var bitcoin = require('bitcoinjs-lib');
var Consumer = (function () {
	function Consumer(privateKey, providerPublicKeyHex, fundTxHashIn, fundTxIndexIn, fundAmount, refundAddressIn) {
		key = bitcoin.ECKey.fromWIF(privateKey);
		providerPubKey = bitcoin.ECPubKey.fromHex(providerPublicKeyHex);
		amount = fundAmount;
		fundTxHash = fundTxHashIn;
		fundTxIndex = fundTxIndexIn;
		refundAddress = refundAddressIn;
	}

	var txFee = 10000;

	var key;
	var amount;
	var providerPubKey;
	var fundTxHash;
	var fundTxIndex;
	var refundAddress;

	var bondTxHash;
	var refundTxAddress;

	var lastSignedRefund;

	Consumer.prototype.createBond = function () {
	var consumerPubKey = key.pub.toHex();
		var pubKeys = [
			providerPubKey,
			consumerPubKey
		];
		var redeemScript = bitcoin.scripts.multisigOutput(2, pubKeys);
		var scriptPubKey = bitcoin.scripts.scriptHashOutput(redeemScript.getHash());
		var address = bitcoin.Address.fromOutputScript(scriptPubKey).toString();
		refundTxAddress = address;

		var tx = new bitcoin.TransactionBuilder();
		tx.addInput(fundTxHash, fundTxIndex);
		tx.addOutput(refundTxAddress, fundAmount);

		bondTxHash = tx.build().toHex();
		return (bondTxHash);
	};

	Consumer.prototype.createIncompleteRefund = function (amount, isInitial) {
		var tx = new bitcoin.TransactionBuilder();
		tx.addInput(bondTxHash, 0);
		tx.addOutput(refundAddress, amount - txFee);
		tx.sign(0, key);
		if (isInitial) {
			var today = new Date();
			var tomorrow = new Date();
			tomorrow.setDate(today.getDate() + 1);
			tx.lockTime = tomorrow.getTime();
		}
		var incompleteRefundTxHash = tx.buildIncomplete().toHex();
		return (incompleteRefundTxHash);
	};

	Consumer.prototype.sendInitialRefund = function () {
		var incompleteRefundTxHash = this.createIncompleteRefund(fundAmount, true);
		//perform send
	};

	Consumer.prototype.receiveRefund = function (signedRefundHash) {
		lastSignedRefund = signedRefundHash;
	};

	Consumer.prototype.sendBond = function () {
		//perform send
	};

	Consumer.prototype.sendNewRefund = function (amount) {
		var incompleteRefundTxHash = this.createIncompleteRefund(amount, false);
		//perform send
	};
}());

module.exports = Consumer;
