import idb from 'idb';

const dbPromise = idb.open('Spree', 1, upgradeDB => {
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
		return dbPromise.then(db => {
			const tx = db.transaction('tasks', 'readwrite');
			tx.objectStore('tasks').put(val, key);
			return tx.complete;
		});
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
				let _key = cursor.key;
				this.get(_key)
				.then((val) => {
					objs[_key] = val;
				});
				cursor.continue();
			});
			return tx.complete.then(() => objs);
		});
	}
};

export { task_db }
