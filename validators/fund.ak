use aiken/hash.{Blake2b_224, Hash}
use aiken/transaction/credential.{VerificationKey}
use aiken/interval.{Finite}
use aiken/transaction.{Transaction, ScriptContext, Spend, ValidityRange}
use vesting/constant.{VerificationKeyHash, POSIXTime}
use vesting/util.{must_be_signed_by, must_start_after}


type Datum {
    fundOwner: VerificationKeyHash,
}

type Redeemer {
    fundOwner: VerificationKeyHash
}

validator (fundOwner: VerificationKeyHash, uniqueId: ByteArray) {
    fn contract(datum: Datum, redeemer: Redeemer, ctx: ScriptContext) -> Bool {
        when ctx.purpose is {
            Spend(_) -> {
                          True
                    }
                // }
            _ -> False
        }
    }
}


