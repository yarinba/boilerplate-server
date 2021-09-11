import { IUnknownObj } from '../types/interfaces/unknown-object.interface';

export const convertObj = (obj: IUnknownObj): IUnknownObj => {
	const columns = Object.keys(obj);
	const newObj: any = {};
	columns.forEach((col: string) => {
		let newColumn = col.split('_');
		if (newColumn.length !== 1) {
			for (let i = 1; i < newColumn.length; i++) {
				newColumn[i] = newColumn[i].charAt(0).toUpperCase() + newColumn[i].slice(1);
			}
			const newColumnName = newColumn.join('');
			newObj[newColumnName] = obj[col];
		} else {
			newObj[col] = obj[col];
		}
	});
	return newObj;
};

export const convertToUnderscore = (obj: IUnknownObj): IUnknownObj => {
	const keys = Object.keys(obj);
	const objToReturn: IUnknownObj = {};
	keys.forEach((key) => {
		const originalKey = key;
		for (let i = 0; i < key.length; i++) {
			let keyData = obj[originalKey];
			if (key[i] === key[i].toUpperCase()) {
				key = key.substring(0, i) + '_' + key[i].toLowerCase() + key.substring(i + 1, key.length);
				i++;
			}
			if (i == key.length - 1) {
				objToReturn[key] = keyData;
			}
		}
	});
	return objToReturn;
};

export const createUpdateQuery = (
	tableName: string,
	cols: string[],
	firstUniqueParam: string,
	firstUniqueKey: string = 'id',
	secondUniqueParam?: string,
	secondsUniqueKey?: string
): string => {
	const query = [`UPDATE ${tableName} SET`];
	const set: string[] = [];
	let index;
	cols.forEach((key, i) => {
		set.push(key + ' = ($' + (i + 1) + ')');
		index = i + 2;
	});
	query.push(set.join(', '));

	if (!secondUniqueParam) {
		query.push(`WHERE ${firstUniqueKey} = '${firstUniqueParam}' RETURNING *`);
	} else {
		query.push(
			`WHERE ${firstUniqueKey} = '${firstUniqueParam}' AND ${secondsUniqueKey} = '${secondUniqueParam}' RETURNING *`
		);
	}
	return query.join(' ');
};
