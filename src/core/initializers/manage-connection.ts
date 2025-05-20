// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { onMount } from 'nanostores';
import type { DAppKitStores } from '../store.js';

import type { UiWallet, UiWalletAccount } from '@wallet-standard/ui';
import { uiWalletAccountBelongsToUiWallet, uiWalletAccountsAreSame } from '@wallet-standard/ui';

/**
 * Handles updating the connection state in response to wallets and their properties changing.
 */
export function manageWalletConnection({ $compatibleWallets, $baseConnection }: DAppKitStores) {
	onMount($compatibleWallets, () => {
		return $compatibleWallets.listen(async (wallets) => {
			const connection = $baseConnection.get();
			if (connection.status !== 'connected') return;

			const resolvedAccount = resolveWalletAccount(connection.currentAccount, wallets);
			if (resolvedAccount) {
				// Update the current account in response to the account properties changing.
				// If the current account was deemed incompatible, we'll default to the
				// first account in the wallet:
				$baseConnection.setKey('currentAccount', resolvedAccount);
			} else {
				// Reset the connection if the underlying wallet was un-registered or deemed incompatible:
				$baseConnection.set({
					status: 'disconnected',
					currentAccount: null,
				});
			}
		});
	});
}

function resolveWalletAccount(currentAccount: UiWalletAccount, wallets: readonly UiWallet[]) {
	for (const wallet of wallets) {
		for (const walletAccount of wallet.accounts) {
			if (uiWalletAccountsAreSame(currentAccount, walletAccount)) {
				return walletAccount;
			}
		}

		if (uiWalletAccountBelongsToUiWallet(currentAccount, wallet) && wallet.accounts[0]) {
			return wallet.accounts[0];
		}
	}

	return null;
}
