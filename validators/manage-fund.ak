use aiken/hash.{Blake2b_224, Hash}
use aiken/transaction/credential.{VerificationKey}
use aiken/interval.{Finite}
use aiken/list
use aiken/transaction.{Transaction, ScriptContext, Spend, ValidityRange}
use vesting/constant.{VerificationKeyHash, POSIXTime}
use vesting/util.{must_be_signed_by, must_start_after}


type Datum {
    admin: VerificationKeyHash,
    fundAddress: ByteArray
}


validator {
    fn contract(datum: Datum, _redeemer: Void, ctx: ScriptContext) -> Bool {
        when ctx.purpose is {
            Spend(_) -> 
                must_be_signed_by(ctx.transaction, datum.admin)
            _ -> False
        }
    }
}


