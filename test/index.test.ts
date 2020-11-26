import dotenv from 'dotenv';
import Feieyun from '../src';

dotenv.config();

const feieyun = new Feieyun({
	user: process.env.USER || '',
	key: process.env.KEY || '',
});

const devSN = process.env.SN || '';

const sampleTicket = `
<CB>测试打印</CB><BR>
名称　　　　　 单价  数量 金额<BR>
--------------------------------<BR>
饭　　　　　 　10.0   10  100.0<BR>
炒饭　　　　　 10.0   10  100.0<BR>
蛋炒饭　　　　 10.0   10  100.0<BR>
鸡蛋炒饭　　　 10.0   10  100.0<BR>
西红柿炒饭　　 10.0   10  100.0<BR>
西红柿蛋炒饭　 10.0   10  100.0<BR>
西红柿鸡蛋炒饭 10.0   10  100.0<BR>
--------------------------------<BR>
送货地点：广州市南沙区xx路xx号<BR>
合计：xx.0元<BR>
备注：加辣<BR>
联系电话：13888888888888<BR>
订餐时间：2014-08-08 08:08:08<BR>
<QR>http://www.feieyun.com</QR>
`;

describe('Feieyun printer test', () => {
	it('Should print a ticket', async () => {
		const res = await feieyun.printTicket({
			sn: devSN,
			content: sampleTicket,
			times: 1,
		});
		console.log(res);
		expect(res).toBeDefined();
	});
});
