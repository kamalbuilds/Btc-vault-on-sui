// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { ReactiveElement } from 'lit';
import { MultiStoreController } from '@nanostores/lit';
import type { DAppKit } from '../core/index.js';

type ValueOf<T> = T[keyof T];
type StoreValues = ValueOf<DAppKit['stores']>[];

/**
 * Property decorator that creates a property that can be assigned different dApp Kit instances.
 * When a property in the internal store changes, it will automatically disconnect the old store's
 * controller and create a new one for the new store.
 *
 * Inspired by https://github.com/nanostores/lit/issues/10#issuecomment-2781516844 :)
 */
export function storeProperty() {
	return function (target: any, propertyKey: PropertyKey) {
		// Create unique symbols for storing the controller and value:
		const controllerKey = Symbol();
		const valueKey = Symbol();

		interface Target extends ReactiveElement {
			[controllerKey]: MultiStoreController<StoreValues> | undefined;
			[valueKey]: DAppKit | undefined;
		}

		Object.defineProperty(target, propertyKey, {
			get(this: Target): DAppKit | undefined {
				return this[valueKey];
			},
			set(this: Target, newInstance: DAppKit | undefined) {
				const oldInstance = this[valueKey];
				if (oldInstance === newInstance) {
					return;
				}

				this[valueKey] = newInstance;

				const existingController = this[controllerKey];
				if (existingController) {
					existingController.hostDisconnected();
					this.removeController(existingController);
				}

				const newController = newInstance
					? new MultiStoreController(this, Object.values(newInstance.stores))
					: undefined;
				this[controllerKey] = newController;

				if (existingController && !newController) {
					// If the instance is removed, request an update. Otherwise the controller should handle it.
					this.requestUpdate(propertyKey, oldInstance);
				}
			},
			configurable: true,
			enumerable: true,
		});
	};
}
