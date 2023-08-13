export default function parseSnapshotData(table, totalVotes, totalLiq) {
	return table.map(row => {
		const {address, authorIpfsHash} = row;
		const timestamp = parseInt(row.timestamp, 10) * 1000;
		const votingPower = parseFloat(row.voting_power);
		const liqAmount = row.voting_power * totalLiq / totalVotes;
		
		return {
			address,
			authorIpfsHash,
			timestamp,
			votingPower,
			liqAmount
		};
	});
}