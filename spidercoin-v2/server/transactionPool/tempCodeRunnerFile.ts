  if (!validateTransaction(tx, unspentTxOuts)) {
            throw Error("Trying to add invalid tx to pool");
        }