import {
  Blockfrost,
  Data,
  Lucid,
  SpendingValidator,
  TxHash,
  fromHex,
  toHex,
  Redeemer,
  UTxO,
} from 'https://deno.land/x/lucid@0.8.3/mod.ts';
import * as cbor from 'https://deno.land/x/cbor@v1.4.1/index.js';

const lucid = await Lucid.new(
  new Blockfrost(
    'https://cardano-preview.blockfrost.io/api/v0/',
    'previewOUGYFtFqq5PnuAhyTBqea5P5Czm5f0oG'
  ),
  'Preview'
);

lucid.selectWalletFromSeed(await Deno.readTextFile('./benificiary.seed'));

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

async function unlock(
  utxos: UTxO[],
  currentTime: number,
  { validator, redeemer }: { validator: SpendingValidator; redeemer: Redeemer }
): Promise<TxHash> {
  const tx = await lucid
    .newTx()
    .collectFrom(utxos, redeemer)
    .addSigner(await lucid.wallet.address())
    .validFrom(currentTime - 100000)
    .validTo(Date.now() + 10000000)
    .attachSpendingValidator(validator)
    .complete();

  const signedTx = await tx.sign().complete();
  return signedTx.submit();
}

async function main() {
  const validator = await readValidator();
  const benificiaryKeyHash = lucid.utils.getAddressDetails(
    await lucid.wallet.address()
  ).paymentCredential?.hash;
  const contractAddress = lucid.utils.validatorToAddress(validator);
  const scriptUTxOs = await lucid.utxosAt(contractAddress);
  const currentTime = new Date().getTime();

  const utxos = scriptUTxOs.filter((utxo) => {
    try {
      const datum = Data.from<Datum>(utxo.datum ?? '', Datum);
      return (
        datum.benificiary === benificiaryKeyHash &&
        datum.lock_until <= currentTime
      );
    } catch (err) {
      //   console.log(err);
      return false;
    }
  });

  if (utxos.length === 0) {
    console.log('No locked UTxOs found');
    Deno.exit(1);
  }

  const redeemer = Data.empty();

  const txHash = await unlock(utxos, currentTime, { validator, redeemer });

  await lucid.awaitTx(txHash);

  console.log('Unlock Id: {}', txHash);
}

main();
