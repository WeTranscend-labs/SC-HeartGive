import {
  Blockfrost,
  Data,
  Lucid,
  SpendingValidator,
  TxHash,
  fromHex,
  toHex,
  app,
  applyParamsToScript,
  applyDoubleCborEncoding,
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
  const validator = JSON.parse(
    await Deno.readTextFile('./plutus.json')
  ).validators.find((validator) => validator.title === 'fund.contract');

  return {
    type: 'PlutusV2',
    script: validator.compiledCode,
  };
}

const Datum = Data.Object({
  admin: Data.String,
  fund_owner: Data.String,
});

type Datum = Data.Static<typeof Datum>;

const jsonData = JSON.stringify(
  {
    organizationName: 'GTVT',
    organizationInfo: {
      description:
        'sadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffff',
      website: 'GTVT',
      email: 'quan02042004@gmail.com',
      phone: '+84938601892',
      address: '97/1c, ấp tam đông, xã thơi tam thôn',
      socialLinks: {
        facebook: 'GTVT',
        twitter: 'GTVT',
        instagram: 'GTVT',
        linkedin: 'GTVT',
      },
    },
    purpose:
      'sadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffffsadfsdfsdffff',
    targetAmount: 100,
    walletAddress: '97/1c, ấp tam đông, xã thơi tam thôn',
    category: 'Education',
    tags: [],
  },
  null,
  0
);

const temp_object = {
  organizationName: 'GTVT',
  organizationInfo: {
    description:
      'Chúng tôi là tổ chức từ thiện Tuổi Hồng, thành lập để giúp các trẻ nhỏ vùng cao',
    website: 'GTVT',
    email: 'quan02042004@gmail.com',
    phone: '+84938601892',
    address: '97/1c, ấp tam đông, xã thơi tam thôn',
    socialLinks: {
      facebook: 'GTVT',
      twitter: 'GTVT',
      instagram: 'GTVT',
      linkedin: 'GTVT',
    },
  },
  purpose:
    'Chúng tôi là tổ chức từ thiện Tuổi Hồng, thành lập để giúp các trẻ nhỏ vùng cao',
  targetAmount: 100,
  walletAddress: '97/1c, ấp tam đông, xã thơi tam thôn',
  category: 'Education',
  tags: [],
};

// console.log(cbor.decode(cbor.encode(jsonData)));

async function lock(
  lovelace: BigInt,
  { validator, datum }: { validator: SpendingValidator; datum: String }
): Promise<TxHash> {
  const encodedScript = toHex(cbor.encode(fromHex(validator.script)));
  const benificiaryPublicKeyHash = lucid.utils.getAddressDetails(
    await Deno.readTextFile('benificiary.addr')
  ).paymentCredential?.hash;

  const lockAddressScript = {
    type: 'PlutusV2',
    script: applyParamsToScript(encodedScript, [
      '0000000000000000000000000000000000000000000000000000000000',
    ]),
  };

  const contractAddress = lucid.utils.validatorToAddress(lockAddressScript);
  const tx = await lucid
    .newTx()
    .payToContract(contractAddress, { inline: datum }, { lovelace })
    .attachMetadata(721, {
      111: {
        data: cbor.encode(jsonData),
      },
    })
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
      admin:
        ownerPublicKeyHash ??
        '0000000000000000000000000000000000000000000000000000000000',
      fund_owner: '0000000000000000000000000000000000000000000000000000000001',
    },
    Datum
  );

  const encodedScript = toHex(cbor.encode(fromHex(validator.script)));

  const lockAddressScript = {
    type: 'PlutusV2',
    script: applyParamsToScript(encodedScript, [benificiaryPublicKeyHash]),
  };

  const contractAddress = lucid.utils.validatorToAddress(lockAddressScript);

  console.log('Contract Address:', contractAddress);
  console.log('Beneficiary Public Key Hash:', benificiaryPublicKeyHash);

  const temp = await lucid.utxosAt(contractAddress);

  console.log(contractAddress);

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

  // Collect And Mint
}

main();
