import {
  Blockfrost,
  Data,
  Lucid,
  SpendingValidator,
  TxHash,
  fromHex,
  toHex,
  UTxO,
} from 'https://deno.land/x/lucid@0.8.3/mod.ts';
import * as cbor from 'https://deno.land/x/cbor@v1.6.0/index.js';

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

console.log(Data);

const Datum = Data.Object({
  admin: Data.String,
  fund_owner: Data.String,
});

const Redeemer = Data.Object({
  is_contribute: Data.BigInt,
  fund_owner: Data.String,
});

type Datum = Data.Static<typeof Datum>;

type Redeemer = Data.Static<typeof Redeemer>;

async function contribute(
  utxo: UTxO,
  additionalLovelace: BigInt,
  { validator, redeemer }: { validator: SpendingValidator; redeemer: Redeemer }
): Promise<TxHash> {
  const contractAddress = lucid.utils.validatorToAddress(validator);
  const tx = await lucid
    .newTx()
    .collectFrom([utxo], redeemer)
    .addSigner(await lucid.wallet.address())
    .attachSpendingValidator(validator)
    .payToContract(
      contractAddress,
      {
        inline: utxo?.datum,
      },
      {
        ...utxo.assets,
        lovelace: (utxo.assets.lovelace ?? 0n) + additionalLovelace,
      }
    )
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

  const selectedUtxo = scriptUTxOs[0];

  // console.log(scriptUTxOs);

  // const utxos = scriptUTxOs.filter((utxo) => {
  //   try {
  //     const datum = Data.from<Datum>(utxo.datum ?? '', Datum);
  //     return datum.fundOwner == benificiaryKeyHash;
  //   } catch (err) {
  //     //   console.log(err);
  //     return false;
  //   }
  // });

  // if (utxos.length === 0) {
  //   console.log('No locked UTxOs found');
  //   Deno.exit(1);
  // }

  const redeemer = Data.to<Redeemer>(
    {
      is_contribute: 1n,
      fund_owner:
        benificiaryKeyHash ??
        '0000000000000000000000000000000000000000000000000000000000',
    },
    Redeemer
  );

  console.log(redeemer);

  const txHash = await contribute(selectedUtxo, 10_000_000n, {
    validator,
    redeemer,
  });

  await lucid.awaitTx(txHash);

  console.log('Unlock Id: {}', txHash);
}

main();
