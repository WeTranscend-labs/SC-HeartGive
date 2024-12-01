use aiken/hash.{Blake2b_224, Hash}
use aiken/transaction/credential.{VerificationKey}
use aiken/interval.{Finite}
use aiken/list
use aiken/transaction.{Transaction, ScriptContext, Spend, ValidityRange}
use vesting/constant.{VerificationKeyHash, POSIXTime}
use vesting/util.{must_be_signed_by, must_start_after}


type Datum {
    lock_until: POSIXTime,
    owner: VerificationKeyHash,
    benificiary: VerificationKeyHash
}

validator {
    fn vesting(datum: Datum, _redeemer: Void, ctx: ScriptContext) -> Bool {
        when ctx.purpose is {
            Spend(_) -> 
                or {
                    must_be_signed_by(ctx.transaction, datum.owner),
                    and {
                        must_be_signed_by(ctx.transaction, datum.benificiary),
                        must_start_after(ctx.transaction.validity_range, datum.lock_until)
                    }
                }
            _ -> False
        }
    }
}


