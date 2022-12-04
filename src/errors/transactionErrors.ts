import type { TransactionReceipt } from 'web3-core';

import {
  ComptrollerErrorReporterError,
  ComptrollerErrorReporterFailureInfo,
  TokenErrorReporterError,
  TokenErrorReporterFailureInfo,
  SebControllerErrorReporterError,
  SebControllerErrorReporterFailureInfo,
  SebVaultErrorReporterError,
  SebVaultErrorReporterInfo,
  MiaVaultProxyErrorReporterError,
  MiaVaultProxyErrorReporterInfo,
} from 'constants/contracts/errorReporter';

import { NError, NErrorPhraseMap } from './NError';

const checkForTransactionError = (
  receipt: TransactionReceipt,
  errorEnum:
    | typeof ComptrollerErrorReporterError
    | typeof TokenErrorReporterError
    | typeof SebControllerErrorReporterError
    | typeof SebVaultErrorReporterError
    | typeof MiaVaultProxyErrorReporterError,
  infoEnum:
    | typeof ComptrollerErrorReporterFailureInfo
    | typeof TokenErrorReporterFailureInfo
    | typeof SebControllerErrorReporterFailureInfo
    | typeof SebVaultErrorReporterInfo
    | typeof MiaVaultProxyErrorReporterInfo,
) => {
  if (receipt.events?.Failure) {
    const { error, info } = receipt.events?.Failure.returnValues;
    throw new NError({
      type: 'transaction',
      code: errorEnum[error] as NErrorPhraseMap['transaction'],
      data: {
        error: errorEnum[error] as NErrorPhraseMap['transaction'],
        info: infoEnum[info] as NErrorPhraseMap['transaction'],
      },
    });
  }
  return receipt;
};

export const checkForComptrollerTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    ComptrollerErrorReporterError,
    ComptrollerErrorReporterFailureInfo,
  );

export const checkForTokenTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(receipt, TokenErrorReporterError, TokenErrorReporterFailureInfo);

export const checkForSebControllerTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    SebControllerErrorReporterError,
    SebControllerErrorReporterFailureInfo,
  );

export const checkForSebVaultTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(receipt, SebVaultErrorReporterError, SebVaultErrorReporterInfo);

export const checkForMiaVaultProxyTransactionError = (receipt: TransactionReceipt) =>
  checkForTransactionError(
    receipt,
    MiaVaultProxyErrorReporterError,
    MiaVaultProxyErrorReporterInfo,
  );
