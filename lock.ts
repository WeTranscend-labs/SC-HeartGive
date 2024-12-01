import {
  Blockfrost,
  Data,
  Lucid,
  SpendingValidator,
  TxHash,
  fromHex,
  toHex,
} from 'https://deno.land/x/lucid@0.8.3/mod.ts';
import * as cbor from 'https://deno.land/x/cbor@v1.4.1/index.js';

const lucid = await Lucid.new(
  new Blockfrost(
    'https://cardano-preview.blockfrost.io/api/v0/',
    'previewOUGYFtFqq5PnuAhyTBqea5P5Czm5f0oG'
  ),
  'Preview'
);

const lock_until = 1672843961000n;

lucid.selectWalletFromSeed(await Deno.readTextFile('./owner.seed'));

async function readValidator(): Promise<SpendingValidator> {
  const validator = JSON.parse(await Deno.readTextFile('./plutus.json'))
    .validators[0];
  return {
    type: 'PlutusV2',
    script: toHex(cbor.encode(fromHex(validator.compiledCode))),
  };
}

const Datum = Data.Object({
  lock_until: Data.BigInt,
  owner: Data.String,
  benificiary: Data.String,
});

type Datum = Data.Static<typeof Datum>;

async function lock(
  lovelace: BigInt,
  { validator, datum }: { validator: SpendingValidator; datum: String }
): Promise<TxHash> {
  const contractAddress = lucid.utils.validatorToAddress(validator);
  const tx = await lucid
    .newTx()
    .payToContract(contractAddress, { inline: datum }, { lovelace })
    .complete();

  const signedTx = await tx.sign().complete();

  return signedTx.submit();
}

async function main() {
  const validator = await readValidator();
  const ownerPublicKeyHash = lucid.utils.getAddressDetails(
    await lucid.wallet.address()
  ).paymentCredential?.hash;
  const benificiaryPublicKeyHash = lucid.utils.getAddressDetails(
    await Deno.readTextFile('benificiary.addr')
  ).paymentCredential?.hash;
  const datum = Data.to<Datum>(
    {
      lock_until: lock_until,
      owner:
        ownerPublicKeyHash ??
        '0000000000000000000000000000000000000000000000000000000000',
      benificiary:
        benificiaryPublicKeyHash ??
        '0000000000000000000000000000000000000000000000000000000000',
    },
    Datum
  );

  const lockUntilDate = new Date(Number(lock_until) * 1000); // Chuyển đổi từ giây sang mili giây

  // In ra thời gian lock_until theo giờ Việt Nam (GMT+7)
  const options = {
    timeZone: 'Asia/Ho_Chi_Minh', // Múi giờ Việt Nam
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Định dạng 24 giờ
  };

  console.log('Lock Until (timestamp):', lock_until);
  console.log(
    'Lock Until (Vietnam Time):',
    lockUntilDate.toLocaleString('en-US', options)
  );

  const txLock = await lock(2_000_000n, { validator, datum });

  await lucid.awaitTx(txLock);

  console.log('Lock Id: {}', txLock);
}

main();
