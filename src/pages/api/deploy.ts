import type { NextApiRequest, NextApiResponse } from 'next'
import { toByteString, UTXO, MethodCallOptions, int2ByteString } from 'scrypt-ts';
import {
    getRawTransaction,
    getDummySigner,
    getDummyUTXO,
    callToBufferList,
    TokenMetadata,
    resetTx,
    toStateScript,
    OpenMinterTokenInfo,
    getOpenMinterContractP2TR,
    OpenMinterContract,
    outpoint2ByteString,
    Postage,
    toP2tr,
    logerror,
    btc,
    getTokenMetadata,
    getTokenMinter,
    getTokenMinterCount,
    MinterType,
    script2P2TR,
    getTokenContractP2TR,
    TokenInfo,
    p2tr2Address
} from '@/lib/scrypt/common';

import {
    getBackTraceInfo,
    OpenMinter,
    OpenMinterProto,
    OpenMinterState,
    ProtocolState,
    CAT20State,
    CAT20Proto,
    PreTxStatesInfo,
    getTxCtx,
    ChangeInfo,
    int32,
    getCatCommitScript,
    OpenMinterV2Proto,
    OpenMinterV2State,
    getSHPreimage,
  OpenMinterV2,
  BurnGuard,
    TransferGuard,
    CAT20
} from '@/lib/scrypt/contracts/dist';
import { WalletService } from '@/lib/scrypt/providers';
import { scaleConfig } from '@/lib/scrypt/token'
import { Transaction } from '@scure/btc-signer';
import * as bitcoinjs from 'bitcoinjs-lib'
import axios from 'axios'
import { API_URL } from '@/lib/constants'
import { getFeeRate, broadcast } from '@/lib/utils'


const OpenMinterArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/openMinter.json');
OpenMinter.loadArtifact(OpenMinterArtifact);

const OpenMinterV2Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/openMinterV2.json')
OpenMinterV2.loadArtifact(OpenMinterV2Artifact);

const BurnGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/burnGuard.json')
BurnGuard.loadArtifact(BurnGuardArtifact);

const TransferGuardArtifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/transferGuard.json')
TransferGuard.loadArtifact(TransferGuardArtifact);


const CAT20Artifact = require('@/lib/scrypt/contracts/artifacts/contracts/token/cat20.json')
CAT20.loadArtifact(CAT20Artifact);


const DUMMY_MINER_SIG = '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' 

const getPremineAddress = async (wallet: WalletService, utxo: UTXO): Promise<string | Error> => {
  const txhex = await getRawTransaction(utxo.txId);
  if (txhex instanceof Error) {
    logerror(`get raw transaction ${utxo.txId} failed!`, txhex);
    return txhex;
  }
  try {
      const tx = new btc.Transaction(txhex);
      const witnesses: Buffer[] = tx.inputs[0].getWitnesses();
      const lockingScript = witnesses[witnesses.length - 2];
      const minter = OpenMinter.fromLockingScript(lockingScript.toString('hex')) as OpenMinter;
      return minter.premineAddr;
  } catch (error) {
      return `${error}`
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function createOpenMinterState(
  mintAmount: int32,
  isPriemined: boolean,
  remainingSupply: int32,
  metadata: TokenMetadata,
  newMinter: number): {
      splitAmountList: bigint[];
      minterStates: OpenMinterState[]
  } {
  const scaledInfo = scaleConfig(metadata.info as OpenMinterTokenInfo);

  const premine = !isPriemined ? scaledInfo.premine : 0n;
  const limit = scaledInfo.limit;
  const splitAmountList = OpenMinterProto.getSplitAmountList(
      premine + remainingSupply,
      mintAmount,
      limit,
      newMinter
  )

  const tokenP2TR = toP2tr(metadata.tokenAddr);

  const minterStates: Array<OpenMinterState> = []
  for (let i = 0; i < splitAmountList.length; i++) {
      const amount = splitAmountList[i]
      if (amount > 0n) {
          const minterState = OpenMinterProto.create(
              tokenP2TR,
              true,
              amount
          )
          minterStates.push(minterState)
      }
  }

  return { splitAmountList, minterStates };
}

export async function getMinter(
  wallet: WalletService,
  genesisId: string,
  tokenInfo: TokenInfo,
) {

  console.log({ tokenInfo })
  // const scaledTokenInfo = scaleConfig(tokenInfo as OpenMinterTokenInfo);
  const scaledTokenInfo = tokenInfo as OpenMinterTokenInfo;
  const premineAddress =
    scaledTokenInfo.premine > 0n ? await wallet.getTokenAddress() : toByteString('');
  return getOpenMinterContractP2TR(
    genesisId,
    scaledTokenInfo.max,
    0n,
    scaledTokenInfo.limit,
    premineAddress,
    tokenInfo.minterMd5,
  );
}

export function getMinterInitialTxState(
  tokenP2TR: string,
  tokenInfo: TokenInfo,
): {
  protocolState: ProtocolState;
  data: OpenMinterV2State;
} {
  const protocolState = ProtocolState.getEmptyState();
  const scaledTokenInfo = scaleConfig(tokenInfo as OpenMinterTokenInfo);
  const maxCount = scaledTokenInfo.max / scaledTokenInfo.limit;
  const premineCount = scaledTokenInfo.premine / scaledTokenInfo.limit;
  const remainingSupply = maxCount - premineCount;
  const minterState = OpenMinterV2Proto.create(
    tokenP2TR,
    false,
    remainingSupply,
  );
  const outputState = OpenMinterV2Proto.toByteString(minterState);
  protocolState.updateDataList(0, outputState);
  return {
    protocolState,
    data: minterState,
  };
}

const buildRevealTx = async (
  wallet: WalletService,
  genesisId: string,
  lockingScript: btc.Script,
  minterType: MinterType,
  info: TokenInfo,
  commitTx: btc.Transaction,
  feeRate: number,
): Promise<{ revealTx: btc.Transaction, tapScript: string, witnesses: Buffer[] }> => {
  const { p2tr: minterP2TR } = await getMinter(
    wallet,
    outpoint2ByteString(genesisId),
    info,
  );

  const { tapScript, cblock } = script2P2TR(lockingScript);
  const { p2tr: tokenP2TR } = getTokenContractP2TR(minterP2TR);

  const { protocolState: txState } = getMinterInitialTxState(tokenP2TR, info);

  const revealTx = new btc.Transaction()
    .from([
      {
        txId: commitTx.id,
        outputIndex: 0,
        script: commitTx.outputs[0].script,
        satoshis: commitTx.outputs[0].satoshis,
      },
      {
        txId: commitTx.id,
        outputIndex: 1,
        script: commitTx.outputs[1].script,
        satoshis: commitTx.outputs[1].satoshis,
      },
    ])
    .addOutput(
      new btc.Transaction.Output({
        satoshis: 0,
        script: toStateScript(txState),
      }),
    )
    .addOutput(
      new btc.Transaction.Output({
        satoshis: Postage.MINTER_POSTAGE,
        script: minterP2TR,
      }),
    )
    .feePerByte(feeRate);

  const witnesses: Buffer[] = [];

  for (let i = 0; i < txState.stateHashList.length; i++) {
    const txoStateHash = txState.stateHashList[i];
    witnesses.push(Buffer.from(txoStateHash, 'hex'));
  }
  witnesses.push(Buffer.from(DUMMY_MINER_SIG, 'hex'));
  witnesses.push(lockingScript);
  witnesses.push(Buffer.from(cblock, 'hex'));

  revealTx.inputs[0].witnesses = witnesses;

  return { revealTx, tapScript, witnesses } ;
};

export async function deploy(
  params: TokenInfo,
  feeRate: number,
  utxos: UTXO[],
  minterType: MinterType,
  wallet: WalletService,
): Promise<
  | ResponseData 
  | undefined
> {
  const changeAddress: btc.Address = await wallet.getAddress();

  const pubkeyX = await wallet.getXOnlyPublicKey();
  const commitScript = getCatCommitScript(pubkeyX, params);

  const lockingScript = Buffer.from(commitScript, 'hex');
  const { p2tr: p2tr } = script2P2TR(lockingScript);

  const changeScript = btc.Script.fromAddress(changeAddress);

  const commitTx = new btc.Transaction()
    .from(utxos)
    .addOutput(
      new btc.Transaction.Output({
        satoshis: Postage.METADATA_POSTAGE,
        script: p2tr,
      }),
    )
    .addOutput(
      /** utxo to pay revealTx fee */
      new btc.Transaction.Output({
        satoshis: 0,
        script: changeScript,
      }),
    )
    .feePerByte(feeRate)
    .change(changeAddress);

  if (commitTx.getChangeOutput() === null) {
    throw new Error('Insufficient satoshi balance!');
  }

  const dummyGenesisId = `${'0000000000000000000000000000000000000000000000000000000000000000'}_0`;

  const { revealTx: revealTxDummy } = await buildRevealTx(
    wallet,
    dummyGenesisId,
    lockingScript,
    minterType,
    params,
    commitTx,
    feeRate,
  );

  const revealTxFee = revealTxDummy.vsize * feeRate + Postage.MINTER_POSTAGE;

  commitTx.outputs[1].satoshis = revealTxFee;

  commitTx.change(changeAddress);
  if (commitTx.outputs[2] && commitTx.outputs[2].satoshi > 1) {
    commitTx.outputs[2].satoshis -= 1;
  }

  const genesisId = `${commitTx.id}_0`;

  const { revealTx, tapScript, witnesses } = await buildRevealTx(
    wallet,
    genesisId,
    lockingScript,
    minterType,
    params,
    commitTx,
    feeRate,
  );

  const { p2tr: minterP2TR } = await getMinter(
    wallet,
    outpoint2ByteString(genesisId),
    params,
  );
  const { p2tr: tokenP2TR } = getTokenContractP2TR(minterP2TR);

  const commitPsbt = Transaction.fromRaw(commitTx.toBuffer());
  let revealPsbt = Transaction.fromRaw(revealTx.toBuffer(), { allowUnknownInputs: true, allowUnknownOutputs: true });

    const psbt_bitcoinjs = bitcoinjs.Psbt.fromHex(Buffer.from(revealPsbt.toPSBT()).toString('hex'));
    psbt_bitcoinjs.updateInput(0, {
        tapLeafScript: [{
            leafVersion: 192,
            script: Buffer.from(tapScript, 'hex'),
            controlBlock: witnesses[witnesses.length - 1],
        }],
    });
  revealPsbt = Transaction.fromPSBT(Buffer.from(psbt_bitcoinjs.toHex(), 'hex'), {
      allowLegacyWitnessUtxo: true,
      allowUnknownOutputs: true
  })

  // @ts-ignore
  for (let i = 0; i < commitPsbt.inputs.length; i++) {
    // @ts-ignore
    const utxo = utxos.find(utxo => utxo.txId === Buffer.from(commitPsbt.inputs[i].txid).toString('hex') && utxo.outputIndex === commitPsbt.inputs[i].index)

    if (!utxo) {
      continue;
    }

    // @ts-ignore
    commitPsbt.inputs[i].witnessUtxo = {
      amount: BigInt(utxo?.satoshis) || 0n,
      script: Buffer.from(utxo?.script, 'hex') || btc.Script.empty(),
    }
    // @ts-ignore
    commitPsbt.inputs[i].tapInternalKey = Buffer.from(await wallet.getXOnlyPublicKey(), 'hex')
    // @ts-ignore
    commitPsbt.inputs[i].sighashType = 1
  }

  console.log(commitPsbt.outputs[0]);

  revealPsbt.inputs[0].witnessUtxo = commitPsbt.outputs[0];
  revealPsbt.inputs[1].witnessUtxo = commitPsbt.outputs[1]
  // revealPsbt.inputs[0].witnessUtxo = {
  //   amount: BigInt(commitPsbt.outputs[0].amount),
  //   script: commitPsbt.outputs[0].script;
  // }

  //  for (let i = 0; i < commitPsbt.inputs.length; i++) {
  //   // @ts-ignore
  //   const utxo = utxos.find(utxo => utxo.txId === Buffer.from(commitPsbt.inputs[i].txid).toString('hex') && utxo.outputIndex === commitPsbt.inputs[i].index)

  //   if (!utxo) {
  //     continue;
  //   }

  //   // @ts-ignore
  //   commitPsbt.inputs[i].witnessUtxo = {
  //     amount: BigInt(utxo?.satoshis) || 0n,
  //     script: Buffer.from(utxo?.script, 'hex') || btc.Script.empty(),
  //   }
  //   // @ts-ignore
  //   commitPsbt.inputs[i].tapInternalKey = Buffer.from(await wallet.getXOnlyPublicKey(), 'hex')
  //   // @ts-ignore
  //   commitPsbt.inputs[i].sighashType = 1
  // }
 
  return {
    tokenId: genesisId,
    tokenAddr: p2tr2Address(tokenP2TR, 'fractal-mainnet'),
    minterAddr: p2tr2Address(minterP2TR, 'fractal-mainnet'),
    commitPsbt: Buffer.from(commitPsbt.toPSBT()).toString('hex'),
    revealPsbt: Buffer.from(revealPsbt.toPSBT()).toString('hex'),
  };
}

type ResponseData = {
    tokenId?: string
    tokenAddr?: string,
    minterAddr?: string,
    commitPsbt?: string,
    revealPsbt?: string,
    message?: string
}
 
async function getIndexerStatus() {
    try {
    const response = await axios.get(`${API_URL}/api?v=1`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching indexer status:', error)
    throw error
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Check indexer status
    await getIndexerStatus();
      
    const payload = req.body;
    const wallet = new WalletService(payload.address, payload.publicKey);

    const params = { ...payload.params, max: 21000000n, limit: 1000n, premine: 0n }

    const response = await deploy(params, payload.feeRate, payload.utxos, MinterType.OPEN_MINTER_V2, wallet);

    if (!response) {
      return res.status(500).json({ message: 'Failed to create PSBT' });
    }

    res.status(200).json(response)
  } catch (error) {
    console.error(error, req.body)
    res.status(500).json({ message: 'Internal server error' })
  }
}