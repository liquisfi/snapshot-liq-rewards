import path from 'path';
import {fileURLToPath} from 'url';
import formatResults from './formatResults.js';
import parseSnapshotData from './parseSnapshotData.js';
import aggregateTable from './utils/aggregateTable.js';
import fs from './utils/fs.js';
import parseCsv from './utils/parseCsv.js';

const rootPath = path.join(fileURLToPath(import.meta.url), '..', '..');
const inputPath = path.join(rootPath, 'input');
const outputPath = path.join(rootPath, 'output');
const totalLiq = 1000000;

async function main() {
	const filespecs = (await fs.readdir(inputPath)).map((filename) => {
		const extname = path.extname(filename);
		const basename = path.basename(filename, extname);
		return {filename, extname, basename};
	}).filter(({extname}) => {
		return extname === '.csv';
	});
	const files = await Promise.all(filespecs.map(async (filespec) => {
		const content = await fs.readFile(path.join(inputPath, filespec.filename), 'utf8');
		return {name: filespec.basename, content};
	}));
	await fs.ensureEmptyDir(outputPath);
	for (const file of files) {
		const rawValues = parseCsv(file.content);
	
		const [table, totalVotes, totalVoters] = aggregateTable(rawValues);
	
		const parsedTable = parseSnapshotData(table, totalVotes, totalLiq);

		const totalRewards = parsedTable.reduce((total, {liqAmount}) => {
			return total + liqAmount;
		}, 0);

		const output = [
			'# TotalVotes',
			totalVotes,
			'',
			'# Total LIQ to distribute',
			totalLiq,
			'',
			'# Actual Total LIQ Rewards',
			totalRewards,
			'',
			'# Total Voters',
			totalVoters,
			'',
			'## Voters',
			
			formatResults(parsedTable),
			'',
		].join('\n');
		await fs.writeFile(path.join(outputPath, `${file.name}.md`), output, 'utf8');
	}
}

main().catch(console.error);
