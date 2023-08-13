export default function aggregateTable(values) {
	const headers = values[0];
	const rows = [];
	let totalVotes = 0;
	let totalVoters = 0;
	for (let rowIndex = 1; rowIndex < values.length; rowIndex++) {
		const row = {};
		headers.forEach((key, columnIndex) => {
			const value = values[rowIndex][columnIndex];
			if (value && value.length) {
				row[key] = value;
			}
		})
		rows.push(row);
		totalVotes += parseFloat(row.voting_power);
		totalVoters += 1;
	}
	return [rows, totalVotes, totalVoters];
}
