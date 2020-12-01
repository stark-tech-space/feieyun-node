import Axios, { AxiosInstance } from 'axios';
import { createHash } from 'crypto';
import qs from 'querystring';

export enum FEIEYUN_API_COMMANDS {
	ADD_PRINTER = 'Open_printerAddlist',
	PRINT_TICKET = 'Open_printMsg',
	PRINT_LABEL = 'Open_printLabelMsg',
	DELETE_PRINTER = 'Open_printerDelList',
	EDIT_PRINTER = 'Open_printerEdit',
	CLEAR_PRINT_JOBS = 'Open_delPrinterSqs',
	QUERY_PRINT_JOB = 'Open_queryOrderState',
	QUERY_PRINT_JOBS_BY_DATE = 'Open_queryOrderInfoByDate',
	QUERY_PRINTER_STATUS = 'Open_queryPrinterStatus',
}

export interface Printer {
	sn: string;
	key: string;
	name?: string;
	cardNumber?: string;
}

/**
 * Feieyun Printer Class
 * @param baseURL api url
 * @param user username
 * @param key api key
 */
export class Feieyun {
	private client: AxiosInstance;
	private user: string;
	private key: string;

	constructor({
		baseURL = 'http://api.jp.feieyun.com/Api/Open',
		timeout = 10000,
		user = '',
		key = '',
	}: {
		baseURL?: string;
		timeout?: number;
		user: string;
		key: string;
	}) {
		this.user = user;
		this.key = key;
		this.client = Axios.create({
			baseURL,
			timeout,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
	}

	private signature(stime: number) {
		const val = this.user + this.key + stime;
		const sha = createHash('sha1');
		sha.update(val);
		return sha.digest('hex');
	}

	private getUnixTime() {
		return Math.floor(new Date().getTime() / 1000);
	}

	private formatDate(date: Date) {
		let month = (date.getMonth() + 1).toString();
		let day = date.getDate().toString();
		const year = date.getFullYear();
		if (month.length < 2) {
			month = `0${month}`;
		}

		if (day.length < 2) {
			day = `0${day}`;
		}

		return `${year}-${day}-${month}`;
	}

	private async request(body: any) {
		const stime = this.getUnixTime();
		const reqParams = {
			user: this.user,
			stime: stime,
			sig: this.signature(stime),
			...body,
		};
		const res = await this.client.post('/', qs.stringify(reqParams));

		if (res.data?.ret < 0) {
			throw new Error(res.data?.msg);
		}

		return res.data;
	}

	/**
	 *
	 * @param printers {sn, key, name, cardNumber }'sn1#key1#remark1#carnum1\nsn2#key2#remark2#carnum2'
	 * example: 316500010 # abcdefgh # Front desk # 13688889999
	 *          316500011 # abcdefgh # kitchen # 13688889990
	 */
	async addPrinters(printers: Printer[] = []) {
		if (printers.length > 100) {
			throw new Error('Maximum 100 printers can be added per batch');
		}
		const printerList = printers
			.map(({ sn, key, name, cardNumber }) => {
				let printerStr = `${sn}#${key}`;
				if (name != null) {
					printerStr += `#${name}`;
				}

				if (cardNumber != null) {
					printerStr += `#${cardNumber}`;
				}
				return printerStr;
			})
			.join('\n');

		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.ADD_PRINTER,
			printerContent: printerList,
		});
		return res;
	}

	async printTicket({
		sn = '',
		content = '',
		times = 1,
	}: {
		sn: string;
		content: string;
		times: number;
	}) {
		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.PRINT_TICKET,
			sn,
			content,
			times: times.toString(),
		});
		return res;
	}

	async printLabel({
		sn = '',
		content = '',
		times = 1,
		img,
	}: {
		sn: string;
		content: string;
		times: number;
		img?: any;
	}) {
		let params: {
			apiname: string;
			sn: string;
			content: string;
			times: string;
			img?: any;
		} = {
			apiname: FEIEYUN_API_COMMANDS.PRINT_LABEL,
			sn,
			content,
			times: times.toString(),
		};
		if (img != null) {
			params.img = img;
		}
		const res = await this.request(params);
		return res;
	}

	async deletePrinters(printers: string[] = []) {
		const snList = printers.join('-');
		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.DELETE_PRINTER,
			snlist: snList,
		});
		return res;
	}

	async editPrinter({
		sn = '',
		name = '',
		phonenum = '',
	}: {
		sn: string;
		name: string;
		phonenum?: string;
	}) {
		let params: {
			apiname: string;
			sn: string;
			name: string;
			phonenum?: string;
		} = {
			apiname: FEIEYUN_API_COMMANDS.EDIT_PRINTER,
			sn,
			name,
		};

		if (phonenum != null) {
			params.phonenum = phonenum;
		}
		const res = await this.request(params);
		return res;
	}

	async clearPrintJobs(sn: string) {
		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.CLEAR_PRINT_JOBS,
			sn,
		});
		return res;
	}

	async queryPrintJob(jobId: string = '') {
		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.QUERY_PRINT_JOB,
			orderid: jobId,
		});
		return res;
	}

	async queryPrintJobsByDate({
		sn = '',
		date = new Date(),
	}: {
		sn: string;
		date: Date;
	}) {
		console.log(this.formatDate(date));
		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.QUERY_PRINT_JOBS_BY_DATE,
			sn,
			date: this.formatDate(date),
		});
		return res;
	}

	async queryPrinterStatus(sn: string = '') {
		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.QUERY_PRINTER_STATUS,
			sn,
		});
		return res;
	}
}

export default Feieyun;
