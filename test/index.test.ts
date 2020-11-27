import dotenv from 'dotenv';
import Feieyun from '../src';

dotenv.config();

const feieyun = new Feieyun({
	user: process.env.API_USER || '',
	key: process.env.API_KEY || '',
});

const devSN = process.env.DEV_SN || '';
const devKey = process.env.DEV_KEY || '';

const sampleTicket = [
	[{ col: 32, value: '<CB>测试打印</CB>' }],
	[{ col: 32, value: '名称　　　　　 单价  数量 金额' }],
	[{ col: 32, value: '--------------------------------' }],
	[{ col: 32, value: '<QR>http://www.feieyun.com</QR>' }],
];

//row length of 32 characters
//price gets 5 chars
//count gets 2 chars
//item total gets 8 chars
//space between all columns
/*
join <BR>
[
  [
    {value: 'string', col: 14},
    {value: 'string', col: 5},
    {value: 'string', col: 2},
    {value: 'string', col: 8}
  ] join ' '
]
*/

type Item = {
	name: string;
	price: number;
	count: number;
	total: number;
};
interface TicketTemplate {
	orderType: string;
	phone: string;
	storeName: string;
	createdAtTitle: string;
	createdAt: string;
	itemTitle: string;
	priceTitle: string;
	countTitle: string;
	itemTotalTitle: string;
	items: Item[];
	subtotalTitle: string;
	subtotal: string;
	shippingFee: string;
	shippingFeeTitle: string;
	costShare: string;
	costShareTitle: string;
	discount: string;
	discountTitle: string;
	total: string;
	totalTitle: string;
	customerName: string;
	customerNameTitle: string;
	address: string;
	addressTitle: string;
	note: string;
	noteTitle: string;
}

const ticketTemplate = ({
	orderType,
	phone,
	storeName,
	createdAtTitle,
	createdAt,
	itemTitle,
	priceTitle,
	countTitle,
	itemTotalTitle,
	items,
	subtotalTitle,
	subtotal,
	shippingFee,
	shippingFeeTitle,
	costShare,
	costShareTitle,
	discount,
	discountTitle,
	total,
	totalTitle,
	customerName,
	customerNameTitle,
	address,
	addressTitle,
	note,
	noteTitle,
}: TicketTemplate) => {
	const itemRows = items.map((item) => [
		{ col: 14, value: item.name },
		{ col: 5, value: item.price },
		{ col: 2, value: item.count },
		{ col: 8, value: item.total },
	]);
	return [
		[
			{
				col: 32,
				value: `<B>${orderType}</B><RIGHT><BOLD>${phone}</BOLD></RIGHT>`,
			},
		],
		[
			{
				col: 32,
				value: storeName,
			},
		],
		[{ col: 32, value: `${createdAtTitle}: ${createdAt}` }],
		[{ col: 32, value: '--------------------------------' }],
		[
			{ col: 14, value: itemTitle },
			{ col: 5, value: priceTitle },
			{ col: 2, value: countTitle },
			{ col: 8, value: itemTotalTitle },
		],
		[{ col: 32, value: '--------------------------------' }],
		...itemRows,
		[{ col: 32, value: '--------------------------------' }],
		[{ col: 32, value: `${subtotalTitle}<RIGHT>${subtotal}</RIGHT>` }],
		[{ col: 32, value: `${shippingFeeTitle}<RIGHT>${shippingFee}</RIGHT>` }],
		[{ col: 32, value: `${costShareTitle}<RIGHT>${costShare}</RIGHT>` }],
		[{ col: 32, value: `${discountTitle}<RIGHT>${discount}</RIGHT>` }],
		[{ col: 32, value: '--------------------------------' }],
		[
			{
				col: 32,
				value: `<BOLD>${totalTitle}<BOLD><RIGHT><BOLD>${total}<BOLD></RIGHT>`,
			},
		],
		[{ col: 32, value: '--------------------------------' }],
		[{ col: 32, value: `${customerNameTitle}: ${customerName}` }],
		[{ col: 32, value: `${addressTitle}: ${address}` }],
		[{ col: 32, value: `${noteTitle}: ${note}` }],
	];
};

describe('Feieyun printer test', () => {
	it('should delete a printer', async () => {
		const res = await feieyun.deletePrinters([devSN]);
		console.log(res);
		expect(res).toBeDefined();
	});

	it('should add a printer', async () => {
		const res = await feieyun.addPrinters([
			{ sn: devSN, key: devKey, name: 'Add Dev Printer' },
		]);
		console.log(res);
		expect(res).toBeDefined();
	});

	it('should edit a printer', async () => {
		const res = await feieyun.editPrinter({
			sn: devSN,
			name: 'Edit Dev Printer',
		});
		console.log(res);
		expect(res).toBeDefined();
	});

	it('should print a ticket', async () => {
		const res = await feieyun.printTicket({
			sn: devSN,
			content: sampleTicket,
			times: 1,
		});
		console.log(res);
		expect(res).toBeDefined();
	});

	it('should print a label', async () => {});

	it('should query print job', async () => {
		const resPrint = await feieyun.printTicket({
			sn: devSN,
			content: sampleTicket,
			times: 1,
		});

		const res = await feieyun.queryPrintJob(resPrint.data);
		console.log(res);
		expect(res).toBeDefined();
	});

	it('should query printer status', async () => {
		const res = await feieyun.queryPrinterStatus(devSN);
		console.log(res);
		expect(res).toBeDefined();
	});

	it('should clear print jobs', async () => {
		const res = await feieyun.clearPrintJobs(devSN);
		console.log(res);
		expect(res).toBeDefined();
	});

	it('should query print jobs by date', async () => {
		const res = await feieyun.queryPrintJobsByDate({
			sn: devSN,
			date: new Date(),
		});
		console.log(res);
		expect(res).toBeDefined();
	});
});
