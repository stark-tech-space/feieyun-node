import dotenv from 'dotenv';
import Feieyun from '../src';
import format from 'date-fns/fp/format';

dotenv.config();

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

const feieyun = new Feieyun({
  user: process.env.API_USER || '',
  key: process.env.API_KEY || '',
});

const devSN = process.env.DEV_SN || '';
const devKey = process.env.DEV_KEY || '';

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

const sampleLabel =
  '<TEXT x="9" y="20" font="12" w="1" h="2" r="0">#001       五号桌      1/3</TEXT><TEXT x="80" y="80" font="12" w="2" h="2" r="0">可乐鸡翅</TEXT><TEXT x="9" y="180" font="12" w="1" h="1" r="0">张三先生       13800138000</TEXT>';

describe('Feieyun printer test', () => {
  it('should delete a printer', async () => {
    const res = await feieyun.deletePrinters([devSN]);
    console.log(res.data);
    expect(res).toBeDefined();
  });

  it('should add a printer', async () => {
    const res = await feieyun.addPrinters([
      { sn: devSN, key: devKey, name: 'Add Dev Printer' },
    ]);
    console.log(res.data);
    expect(res).toBeDefined();
  });

  it('should edit a printer', async () => {
    const res = await feieyun.editPrinter({
      sn: devSN,
      name: 'Edit Dev Printer',
    });
    console.log(res.data);
    expect(res).toBeDefined();
  });

  it('should print a ticket', async () => {
    const stringLengthInView = (str: string) => {
      const fullCharRegexArr = [
        // chinese
        new RegExp(/[\u2e80-\u2fdf]/g),
        new RegExp(/[\u31a0-\u31bf]/g),
        new RegExp(/[\u3400-\u4dbf]/g),
        new RegExp(/[\u4e00-\u9fff]/g),
        new RegExp(/[\uf900-\ufaff]/g),
        // japanese
        new RegExp(/[\u3040-\u30ff]/g),
        new RegExp(/[\u31f0-\u31ff]/g),
        // korean
        new RegExp(/[\u1100-\u11ff]/g),
        new RegExp(/[\u3130-\u318f]/g),
        new RegExp(/[\uac00-\ud7af]/g),
      ];

      let strLength = new Array<number>();
      for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        strLength.push(
          fullCharRegexArr.some((regex) => char.match(regex)) ? 2 : 1
        );
      }

      return strLength;
    };

    const splitter = '--------------------------------';
    const header = ({
      orderType,
      phoneNumber,
      storeName,
      createdAt,
    }: {
      orderType: string;
      phoneNumber: string;
      storeName: string;
      createdAt: Date;
    }) =>
      `<B><BOLD>${orderType} ${phoneNumber}</BOLD></B><BR><BR>${storeName}<BR>結帳時間: ${format(
        'MM/dd HH:mm',
        createdAt
      )}<BR>${splitter}<BR>餐點品項    單價    數量    金額<BR><BR>`;

    const priceCalculate = ({
      subtotal,
      total,
      shippingFee,
      costShare,
      discount = 0,
    }: {
      subtotal: number;
      total: number;
      costShare: number;
      shippingFee: number;
      discount?: number;
    }) => {
      const subtotalStr = subtotal.toString();
      const subtotalContent = `小計${subtotalStr.padStart(28, ' ')}`;
      const shippingFeeStr = shippingFee.toString();
      const shippingFeeContent = `運費${shippingFeeStr.padStart(28, ' ')}`;
      const costShareStr = (-costShare).toString();
      const costShareContent = `運費補助${costShareStr.padStart(24, ' ')}`;
      const discountStr = (-discount).toString();
      const discountContent = `優惠${discountStr.padStart(28, ' ')}`;
      const totalStr = total.toString();
      const totalContent = `總計${totalStr.padStart(28, ' ')}`;

      return `${splitter}<BR>${subtotalContent}<BR>${shippingFeeContent}<BR>${costShareContent}<BR>${discountContent}<BR><BOLD>${totalContent}</BOLD><BR>${splitter}<BR>`;
    };

    const headerContent = header({
      orderType: '外送',
      phoneNumber: '0955940336',
      storeName: '窩送小舖',
      createdAt: new Date(),
    });
    const priceContent = priceCalculate({
      subtotal: 3600,
      total: 3590,
      shippingFee: 50,
      costShare: 50,
      discount: 0,
    });

    // 		`--------------------------------<BR>
    // 小計                       3600<BR>
    // 運費                         50<BR>
    // 運費補助                    -50<BR>
    // 優惠                        -10<BR>
    // <BOLD>
    // 總計                       3590
    // </BOLD><BR>
    // --------------------------------<BR>`;
    const memberInfo = ({
      customerName,
      customerAddress,
      orderNote,
    }: {
      customerName: string;
      customerAddress: string;
      orderNote: string;
    }) =>
      `會員姓名: ${customerName}<BR>地址: ${customerAddress}<BR>備註: ${orderNote}<BR><BR><BR>`;
    const memberContent = memberInfo({
      customerName: 'Frank Su',
      customerAddress: '台灣台北市大安區信義路四段88號B18',
      orderNote: '測試訂單',
    });

    type Item = {
      name: string;
      price: number;
      count: number;
      total: number;
    };

    const itemsInfo = (items: Item[]) => {
      const itemContent = items.reduce((prev, item) => {
        const itemNameArr = new Array<string>();
        let itemName = item.name;
        let itemNameLengthInView = 0;
        do {
          let stringLengthTotal = 0;
          const stringLengthArr = stringLengthInView(itemName);
          itemNameLengthInView = stringLengthArr.reduce(
            (prev, charLength) => prev + charLength
          );
          const indexOverflowAt = stringLengthArr.findIndex((length) => {
            stringLengthTotal += length;
            return stringLengthTotal > 10;
          });
          if (indexOverflowAt !== -1) {
            itemNameArr.push(itemName.substring(0, indexOverflowAt));
            itemName = itemName.substr(indexOverflowAt);
          } else {
            itemNameArr.push(itemName);
          }
        } while (itemNameLengthInView > 10);

        return prev.concat(
          itemNameArr.map((itemName, index) => {
            if (index > 0) {
              return itemName;
            }

            let itemNameInView = `${itemName}`;
            const itemNameLengthAtFirst = stringLengthInView(itemName).reduce(
              (prev, length) => prev + length
            );
            if (itemNameLengthAtFirst < 10) {
              for (let i = 0; i < 10 - itemNameLengthAtFirst; i++) {
                itemNameInView = `${itemNameInView} `;
              }
            }

            const priceStr = item.price.toString();
            const priceContent =
              priceStr.length >= 8
                ? priceStr
                : priceStr.padEnd(6, ' ').padStart(8, ' ');
            const countStr = item.count.toString();
            const countContent =
              countStr.length >= 8
                ? countStr
                : countStr.padEnd(6, ' ').padStart(8, ' ');
            const totalStr = item.total.toString();
            const totalContent =
              totalStr.length >= 6 ? totalStr : totalStr.padStart(6, ' ');

            return `${itemNameInView}${priceContent}${countContent}${totalContent}`;
          })
        );
      }, new Array<string>());
      return `${itemContent.join('<BR>')}<BR>`;
    };

    const itemsContent = itemsInfo([
      {
        name: '照燒雞腿雞腿雞腿雞腿雞腿雞腿堡*少辣',
        price: 120,
        count: 10,
        total: 1200,
      },
    ]);

    const allRes = await Promise.all([
      feieyun.printTicket({
        sn: devSN,
        content: `1${headerContent}${itemsContent}${priceContent}${memberContent}`,
        times: 1,
      }),
      feieyun.printTicket({
        sn: devSN,
        content: `2${headerContent}${itemsContent}${priceContent}${memberContent}`,
        times: 1,
      }),
    ]);

    console.log('res', allRes);
    expect(allRes).toBeDefined();
  }, 90000);

  it('should print a label', async () => {
    const items = [
      {
        name: '照燒雞腿堡',
        price: 120,
        note: '我是備註',
        modiifers: [
          {
            options: [
              {
                name: '微冰',
                price: 0,
              },
            ],
          },
          {
            options: [
              {
                name: '微糖',
                price: 0,
              },
            ],
          },
          {
            options: [
              {
                name: '芋圓',
                price: 10,
              },
            ],
          },
          {
            options: [
              {
                name: '珍珠',
                price: 10,
              },
            ],
          },
        ],
      },
      {
        name: '照燒雞腿堡2',
        price: 120,
        note: '我是備註2',
        modiifers: [
          {
            options: [
              {
                name: '微冰2',
                price: 0,
              },
            ],
          },
          {
            options: [
              {
                name: '微糖2',
                price: 0,
              },
            ],
          },
          {
            options: [
              {
                name: '芋圓2',
                price: 10,
              },
            ],
          },
          {
            options: [
              {
                name: '珍珠2',
                price: 10,
              },
            ],
          },
        ],
      },
    ];

    const itemsContent = items.map((item, index) => {
      let modifierOptions = new Array<string>();
      const price =
        item.price +
        item.modiifers.reduce((itemModifersPrice, modifier) => {
          return (
            itemModifersPrice +
            modifier.options.reduce((modifierOptionsPrice, option) => {
              modifierOptions.push(option.name);
              return modifierOptionsPrice + option.price;
            }, 0)
          );
        }, 0);
      const priceStr = price.toString();
      modifierOptions =
        modifierOptions.length < 4
          ? modifierOptions
          : modifierOptions.slice(0, 3);

      return `<TEXT x="20" y="27" font="11" w="2" h="2" r="0">${index + 1}/${
        items.length
      }</TEXT>
      <TEXT x="179" y="35" font="11" w="1" h="1" r="0">${format(
        'MM/dd HH:mm',
        new Date()
      )}</TEXT>
      <TEXT x="20" y="80" font="11" w="1" h="1" r="0">${
        item.name
      }-${`Frank_${index}`}</TEXT>
      <TEXT x="20" y="88" font="5" w="10" h="1" r="0">-</TEXT>${modifierOptions.map(
        (optionName, optionIndex) =>
          `<TEXT x="20" y="${
            122 + 31 * optionIndex
          }" font="11" w="1" h="1" r="0">*${optionName}</TEXT>`
      )}
      <TEXT x="20" y="215" font="11" w="1" h="1" r="0">${item.note}</TEXT>
      <TEXT x="${
        284 - 8 * priceStr.length
      }" y="215" font="11" w="1" h="1" r="0">$${priceStr}</TEXT>`;
    });

    const result = await feieyun.printLabel({
      sn: devSN,
      content: itemsContent,
      times: 1,
    });

    const labelPrintPromises = itemsContent.map(
      async (content, index) =>
        await new Promise((resolve, reject) => {
          setTimeout(async () => {
            try {
              const result = await feieyun.printLabel({
                sn: devSN,
                content: content,
                times: 1,
              });
              console.log(new Date());
              resolve(result);
            } catch (error) {
              reject(error);
            }
          }, 1000 * index);
        })
    );
    const labelPrintResult = await Promise.all(labelPrintPromises);

    console.log(labelPrintResult);
    // expect(res).toBeDefined();
  });

  it('should query print job', async () => {
    const resPrint = await feieyun.printLabel({
      sn: devSN,
      content: sampleLabel,
      times: 1,
    });

    const res = await feieyun.queryPrintJob(resPrint.data);
    console.log(res.data);
    expect(res).toBeDefined();
  });

  it('should query printer status', async () => {
    const res = await feieyun.queryPrinterStatus(devSN);
    console.log(res.data);
    expect(res).toBeDefined();
  });

  it('should clear print jobs', async () => {
    const res = await feieyun.clearPrintJobs(devSN);
    console.log(res.data);
    expect(res).toBeDefined();
  });

  it('should query print jobs by date', async () => {
    const res = await feieyun.queryPrintJobsByDate({
      sn: devSN,
      date: new Date(),
    });
    expect(res).toBeDefined();
  });
});
