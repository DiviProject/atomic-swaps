declare const process, describe, it;

import * as exec from 'execa';
import * as superagent from 'superagent';
import { read } from 'fs-jetpack';
import { assert } from 'chai';
import execa = require('execa');

const BP = process.env.BINARY_PATH || '../dist/atomicswap';
const URL = process.env.SERVER_URL || 'http://localhost:9001';
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

let asp = null;

describe(`Atomic Swap HTTP testing suite`, () => {

    it('Should start a gRPC node', async () => {
        try {
            asp = execa(BP, ['-r', '-u', 'bitcoin', '-p', 'bitcoin', '--rpc-port', '1338']);
        } catch (error) {
            throw error;
        }
    });

    it('Should ping the gRPC server', async () => {
        try {
            const payload = await superagent.post(`${URL}/v1/ping`);
            assert(payload.body.ping, "pong");
        } catch (error) {
            throw error;
        }
    });

    it('Should initiate an atomic swap', async () => {
        try {
            const payload = await superagent
                .post(`${URL}/v1/initiate`)
                .send({
                    address: BitcoinAddress,
                    amount: '1.0',
                });

            const body = payload.body;

            tx.secret = body.secret;
            tx.secretHash = body.secretHash;
            tx.contractAddress = body.contractAddress;
            tx.contractBytes = body.contractBytes;
            tx.contractHash = body.contractTransaction;
            tx.contractHashBytes = body.contractTransactionBytes;
            tx.refundHash = body.contractRefund;
        } catch (error) {
            throw error;
        }
    });

    it('Should participate in an atomic swap', async () => {
        try {
            const payload = await superagent
                .post(`${URL}/v1/participate`)
                .send({
                    address: BitcoinAddress,
                    amount: '1.0',
                    hash: tx.secret,
                });
        } catch (error) {
            throw error;
        }
    });

    it('Should redeem an atomic swap', async () => {
        try {
            const payload = await superagent
                .post(`${URL}/v1/redeem`)
                .send({
                    contract: tx.contractBytes,
                    transaction: tx.contractHashBytes,
                    secret: tx.secret,
                });
        } catch (error) {
            throw error;
        }
    });

    it('Should initiate another atomic swap', async () => {
        try {
            const payload = await superagent
                .post(`${URL}/v1/initiate`)
                .send({
                    address: BitcoinAddress,
                    amount: '1.0',
                });

            const body = payload.body;

            tx.secret = body.secret;
            tx.secretHash = body.secretHash;
            tx.contractAddress = body.contractAddress;
            tx.contractBytes = body.contractBytes;
            tx.contractHash = body.contractTransaction;
            tx.contractHashBytes = body.contractTransactionBytes;
            tx.refundHash = body.contractRefund;
        } catch (error) {
            throw error;
        }
    });

    it('Should refund an atomic swap', async () => {
        try {
            const payload = await superagent
                .post(`${URL}/v1/refund`)
                .send({
                    contract: tx.contractBytes,
                    transaction: tx.contractHashBytes,
                });
        } catch (error) {
            throw error;
        }
    });

    it('Should stop the gRPC node', async () => {
        try {
            asp.cancel();
        } catch (error) {
            throw error;
        }
    });

});