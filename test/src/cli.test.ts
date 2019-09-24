declare const process, describe, it;

import * as exec from 'execa';
import { read } from 'fs-jetpack';
import { assert } from 'chai';

const BP = process.env.BINARY_PATH || '../dist/atomicswap';
const DiviAddress = process.env.DIVI_ADDRESS;
const BitcoinAddress = process.env.BITCOIN_ADDRESS;

const tx = {
    secret: '',
    secretHash: '',
    contractAddress: '',
    contractBytes: '',
    contractHash: '',
    contractHashBytes: '',
    refundHash: '',
    refundHashBytes: '',
};

describe(`Atomic Swap CLI testing suite`, () => {

    it(`Should output the help command of the binary`, async () => {
        try {
            const { stderr, stdout } = await exec(BP, ['help']);
        } catch (error) {
            throw error;
        }
    });

    it(`Should be able to specify an atomic swap config file`, async () => {
        try {
            const { stderr, stdout } = await exec(BP, ['--config', '.atomicswap.divi.json', 'help']);
        } catch (error) {
            throw error;
        }
    });

    it(`Should initiate an atomic swap with a Bitcoin regtest node`, async () => {
        try {
            const { stderr, stdout } = await exec(BP, ['-r', '-u', 'bitcoin', '-p', 'bitcoin', '--rpc-port', '1338', '-y', 'initiate', BitcoinAddress, '1.0']);
            
            tx.secret = stdout.split('Secret:')[1].split('\n')[0].trim();
            tx.secretHash = stdout.split('Secret hash:')[1].split('\n')[0].trim();
            tx.contractAddress = stdout.split('Contract (')[1].split('):')[0].trim();
            tx.contractBytes = stdout.split(`${tx.contractAddress}):`)[1].split('\n')[1].trim();
            tx.contractHash = stdout.split('Contract transaction (')[1].split('):')[0].trim();
            tx.contractHashBytes = stdout.split(`${tx.contractHash}):`)[1].split('\n')[1].trim();
            tx.refundHash = stdout.split(`Refund transaction (`)[1].split('):')[0].trim();
            tx.refundHashBytes = stdout.split(`${tx.refundHash}):`)[1].split('\n')[1].trim();
        } catch (error) {
            throw error;
        }
    });

    it(`Should participate in an atomic swap with a Bitcoin regtest node`, async () => {
        try {
            const { stderr, stdout } = await exec(BP, ['-r', '-u', 'bitcoin', '-p', 'bitcoin', '--rpc-port', '1338', '-y', 'participate', BitcoinAddress, '1.0', tx.secret]);
        } catch (error) {
            throw error;
        }
    });

    it(`Should redeem in an atomic swap with a Bitcoin regtest node`, async () => {
        try {
            const { stderr, stdout } = await exec(BP, ['-r', '-u', 'bitcoin', '-p', 'bitcoin', '--rpc-port', '1338', '-y', 'redeem', tx.contractBytes, tx.contractHashBytes, tx.secret]);
        } catch (error) {
            throw error;
        }
    });

    it(`Should initiate another atomic swap with a Bitcoin regtest node`, async () => {
        try {
            const { stderr, stdout } = await exec(BP, ['-r', '-u', 'bitcoin', '-p', 'bitcoin', '--rpc-port', '1338', '-y', 'initiate', BitcoinAddress, '1.0']);
            
            tx.secret = stdout.split('Secret:')[1].split('\n')[0].trim();
            tx.secretHash = stdout.split('Secret hash:')[1].split('\n')[0].trim();
            tx.contractAddress = stdout.split('Contract (')[1].split('):')[0].trim();
            tx.contractBytes = stdout.split(`${tx.contractAddress}):`)[1].split('\n')[1].trim();
            tx.contractHash = stdout.split('Contract transaction (')[1].split('):')[0].trim();
            tx.contractHashBytes = stdout.split(`${tx.contractHash}):`)[1].split('\n')[1].trim();
            tx.refundHash = stdout.split(`Refund transaction (`)[1].split('):')[0].trim();
            tx.refundHashBytes = stdout.split(`${tx.refundHash}):`)[1].split('\n')[1].trim();
        } catch (error) {
            throw error;
        }
    });

    it(`Should refund an atomic swap with a Bitcoin regtest node`, async () => {
        try {
            const { stderr, stdout } = await exec(BP, ['-r', '-u', 'bitcoin', '-p', 'bitcoin', '--rpc-port', '1338', '-y', 'refund', tx.contractBytes, tx.contractHashBytes]);
        } catch (error) {
            throw error;
        }
    });

});