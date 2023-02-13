import { writable } from 'svelte/store';
import type { StorageType } from './storage';
import { storageDefault } from './storage';
import type Alert from '@/components/Alert.svelte';

export const mainStore = writable<StorageType>(storageDefault)
export const alertStore = writable<Alert>(null)
