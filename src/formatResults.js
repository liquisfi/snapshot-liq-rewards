import formatTableMd from './utils/formatTableMd.js';

export default function formatResults(result) {
	const rows = [
		['Address', 'Voting Power', 'LIQ Reward']
	];
	result.forEach(({address, votingPower, liqAmount}) => {
		rows.push([address, votingPower, liqAmount]);
	});
	return formatTableMd(rows);
};
