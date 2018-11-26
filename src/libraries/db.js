import idb from 'idb';
import { Store, set, keys, get } from 'idb-keyval';

const customStore = new Store('insanity', 'tasks');
set('foo', 'bar', customStore);
keys(customStore).then(keys => {
	keys.map(i => {
		get(i, customStore).then(val => console.log(val));
	})
});

const dbPromise = idb.open('insanity', 1, upgradeDB => {
	upgradeDB.createObjectStore('tasks');
});

const task_db = {
	get(key) {
		return dbPromise.then(db => {
			return db.transaction('tasks')
			.objectStore('tasks').get(key);
		});
	},
	set(key, val) {
		return set(key, val, customStore);
		//return dbPromise.then(db => {
			//const tx = db.transaction('tasks', 'readwrite');
			//tx.objectStore('tasks').put(val, key);
			//return tx.complete;
		//});
	},
	delete(key) {
		return dbPromise.then(db => {
			const tx = db.transaction('tasks', 'readwrite');
			tx.objectStore('tasks').delete(key);
			return tx.complete;
		});
	},
	clear() {
		return dbPromise.then(db => {
			const tx = db.transaction('tasks', 'readwrite');
			tx.objectStore('tasks').clear();
			return tx.complete;
		});
	},
	keys() {
		return dbPromise.then(db => {
			const tx = db.transaction('tasks');
			const objs ={};
			const store = tx.objectStore('tasks');
			// This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
			// openKeyCursor isn't supported by Safari, so we fall back
			(store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
				if (!cursor) return;
				this.get(cursor.key)
				.then((val) => {
					objs[cursor.key] = val;
				});
				cursor.continue();
			});
			return tx.complete.then(() => objs);
		});
	}
};

export { task_db }
