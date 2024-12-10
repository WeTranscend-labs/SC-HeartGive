use aiken/hash.{Blake2b_224, Hash}
use aiken/transaction/credential.{VerificationKey}
use aiken/interval.{Finite}
use aiken/list
use aiken/transaction.{Transaction, ScriptContext, Spend, ValidityRange}
use vesting/constant.{VerificationKeyHash, POSIXTime}
use vesting/util.{must_be_signed_by, must_start_after}


type Datum {
    fundOwner: VerificationKeyHash,
}

type Redeemer {
    isContribute: Int,
    fundOwner: VerificationKeyHash
}

validator (fundOwner: VerificationKeyHash, uniqueId: ByteArray) {
    fn contract(datum: Datum, redeemer: Redeemer, ctx: ScriptContext) -> Bool {
        when ctx.purpose is {
            Spend(_) -> 
                // or {
                    // must_be_signed_by(ctx.transaction, datum.admin),
                    when redeemer.isContribute is {
                        // rút tiền về ví của tổ chức
                        0 -> {
                            must_be_signed_by(ctx.transaction, datum.fundOwner)
                        }
                        // Đóng góp
                        1 -> {
                            // datum.fund_owner == redeemer.fund_owner
                            True
                        }
                        _ -> False
                    }
                // }
            _ -> False
        }
    }
}


