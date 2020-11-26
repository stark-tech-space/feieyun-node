import Axios, { AxiosInstance } from 'axios';
import { createHash } from 'crypto';

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
	public debug: boolean;

	constructor({
		baseURL = 'http://api.jp.feieyun.com/Api/Open',
		timeout = 10000,
		user = '',
		key = '',
		isDebug = false,
	}: {
		baseURL?: string;
		timeout?: number;
		user: string;
		key: string;
		isDebug?: boolean;
	}) {
		this.debug = isDebug;
		this.user = user;
		this.key = key;
		this.client = Axios.create({
			baseURL,
			timeout,
		});
	}

	private signture(stime: number) {
		const val = `${this.user}${this.key}${stime}`;
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
			day = `0${month}`;
		}

		return `${year}-${day}-${month}`;
	}

	private request(body: Object) {
		const stime = this.getUnixTime();
		return this.client.post('/', {
			user: this.user,
			stime,
			sig: this.signture(stime),
			debug: this.debug,
			...body,
		});
	}

	/**
	 *
	 * @param printers 'sn1#key1#remark1#carnum1\nsn2#key2#remark2#carnum2'
	 * example: 316500010 # abcdefgh # Front desk # 13688889999
	 *          316500011 # abcdefgh # kitchen # 13688889990
	 */
	async addPrinter(printers: string = '') {
		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.ADD_PRINTER,
			printerContent: printers,
		});
		return res.data;
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
		return res.data;
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
		return res.data;
	}

	async deletePrinter(printers: string = '') {
		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.DELETE_PRINTER,
			snlist: printers,
		});
		return res.data;
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
		return res.data;
	}

	async clearPrintJobs(sn: string) {
		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.CLEAR_PRINT_JOBS,
			sn,
		});
		return res.data;
	}

	async queryPrintJob(jobId: string = '') {
		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.QUERY_PRINT_JOB,
			orderid: jobId,
		});
		return res.data;
	}

	async queryPrintJobsByDate({
		sn = '',
		date = new Date(),
	}: {
		sn: string;
		date: Date;
	}) {
		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.QUERY_PRINT_JOBS_BY_DATE,
			sn,
			date: this.formatDate(date),
		});
		return res.data;
	}

	async Open_queryPrinterStatus(sn: string = '') {
		const res = await this.request({
			apiname: FEIEYUN_API_COMMANDS.QUERY_PRINTER_STATUS,
			sn,
		});
		return res.data;
	}
}

export default Feieyun;
