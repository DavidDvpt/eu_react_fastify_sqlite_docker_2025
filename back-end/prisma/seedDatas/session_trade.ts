import type { Prisma } from '../generated/client.js';
import { SYSTEM_USER_ID } from './systemUser.js';

const TRADE_IN_TRANSACTIONS: Array<{
  id: string;
  transaction_type: 'PURCHASE' | 'EXISTING_STOCK' | 'FOUND' | 'GIFT' | 'GIVEN';
  quantity: number;
  tt_value: number;
  ttc_value: number;
  item_id: string;
  user_id: string | null;
}> = [
  {
    "id": "01429DE0-80B3-4EAF-8FCB-8490604C4BDE",
    "transaction_type": "PURCHASE",
    "quantity": 1415,
    "tt_value": 636.75,
    "ttc_value": 642,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "01C53A1C-9346-46CA-848B-04E8A325DB61",
    "transaction_type": "PURCHASE",
    "quantity": 755,
    "tt_value": 181.2,
    "ttc_value": 189,
    "item_id": "39E70583-067C-4459-BFD4-1C50DB0A9BF0",
    "user_id": null
  },
  {
    "id": "04FADB88-BA86-4F0C-A02F-785A82D58F82",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 19,
    "tt_value": 9.5,
    "ttc_value": 9.5,
    "item_id": "3D869176-06A5-4399-B37F-82E229E1522E",
    "user_id": null
  },
  {
    "id": "07BA1843-6302-4F6F-A3AE-754E9279E2DF",
    "transaction_type": "PURCHASE",
    "quantity": 140,
    "tt_value": 105,
    "ttc_value": 109,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "09635B44-B2FA-403B-A3E4-4FB57B37DF37",
    "transaction_type": "PURCHASE",
    "quantity": 974,
    "tt_value": 233.76,
    "ttc_value": 256,
    "item_id": "39E70583-067C-4459-BFD4-1C50DB0A9BF0",
    "user_id": null
  },
  {
    "id": "0B3F0AC8-E5E3-40EF-9C6E-25175EAE54EC",
    "transaction_type": "PURCHASE",
    "quantity": 242,
    "tt_value": 125.84,
    "ttc_value": 141,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "0ECFE29A-72DB-4172-9BD1-483711734AB3",
    "transaction_type": "PURCHASE",
    "quantity": 273,
    "tt_value": 204.75,
    "ttc_value": 216,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "0EF76CD2-EE2B-4059-B981-47950B7D4CEF",
    "transaction_type": "PURCHASE",
    "quantity": 314,
    "tt_value": 235.5,
    "ttc_value": 247,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "0F3A5947-1F00-4139-91C2-459DCE1EE20A",
    "transaction_type": "PURCHASE",
    "quantity": 1906,
    "tt_value": 228.72,
    "ttc_value": 231,
    "item_id": "2B897E98-2235-4227-ACE4-D429BD172A7A",
    "user_id": null
  },
  {
    "id": "13F7F41E-284C-4284-B7D0-C12453378F41",
    "transaction_type": "PURCHASE",
    "quantity": 195,
    "tt_value": 101.4,
    "ttc_value": 106,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "1650D9ED-4911-44B6-A9D2-F26A8154D591",
    "transaction_type": "PURCHASE",
    "quantity": 10000,
    "tt_value": 300,
    "ttc_value": 311,
    "item_id": "F9A28E31-AA19-419F-B2FD-02C3882EF13C",
    "user_id": null
  },
  {
    "id": "179625C2-7129-430B-B988-CAF66E5B93A8",
    "transaction_type": "PURCHASE",
    "quantity": 1000,
    "tt_value": 450,
    "ttc_value": 460,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "17AE3029-BAF7-42DE-BCAB-4FB5D61E70E3",
    "transaction_type": "PURCHASE",
    "quantity": 247,
    "tt_value": 128.44,
    "ttc_value": 138,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "18595DB5-457E-4D20-8B01-5567F07962D4",
    "transaction_type": "PURCHASE",
    "quantity": 270,
    "tt_value": 64.8,
    "ttc_value": 67,
    "item_id": "39E70583-067C-4459-BFD4-1C50DB0A9BF0",
    "user_id": null
  },
  {
    "id": "1B366308-8827-426D-A523-567BBFC8EF11",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 97,
    "tt_value": 19.4,
    "ttc_value": 19.4,
    "item_id": "5E0842B2-BE93-478B-ABA9-21D1D4E4E66D",
    "user_id": null
  },
  {
    "id": "1BDAB59B-5CEF-4B9F-94B9-D1DD94252FA4",
    "transaction_type": "PURCHASE",
    "quantity": 250,
    "tt_value": 130,
    "ttc_value": 137,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "1C2E5D70-29AB-495C-B601-CCD795840D52",
    "transaction_type": "PURCHASE",
    "quantity": 595,
    "tt_value": 142.8,
    "ttc_value": 150,
    "item_id": "39E70583-067C-4459-BFD4-1C50DB0A9BF0",
    "user_id": null
  },
  {
    "id": "1CA77553-2D03-473E-B060-1EBA7A5D84B1",
    "transaction_type": "PURCHASE",
    "quantity": 39,
    "tt_value": 29.25,
    "ttc_value": 31,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "1DC4E511-F4D1-4EDF-9B04-3573B04D3846",
    "transaction_type": "PURCHASE",
    "quantity": 443,
    "tt_value": 199.35,
    "ttc_value": 201,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "1E68975F-0B0C-4A51-BE73-B1267B0B76E1",
    "transaction_type": "PURCHASE",
    "quantity": 10000,
    "tt_value": 400,
    "ttc_value": 407,
    "item_id": "068C9188-821C-4E74-9A54-F6C03C07333F",
    "user_id": null
  },
  {
    "id": "1F023044-5BDA-4641-B903-CB76CD38DB9A",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 0.78,
    "ttc_value": 0.78,
    "item_id": "EF04ACF6-9E49-4AB7-97F5-C5E283CE7249",
    "user_id": null
  },
  {
    "id": "209BDCA3-D8DC-4D28-BC1D-7DEDA786511D",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 98,
    "tt_value": 29.4,
    "ttc_value": 29.4,
    "item_id": "42963146-5158-4666-8EE8-A71925481958",
    "user_id": null
  },
  {
    "id": "2178C25B-47E1-424C-B011-95C7D1135A27",
    "transaction_type": "PURCHASE",
    "quantity": 500,
    "tt_value": 375,
    "ttc_value": 415,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "2236C201-6044-4E0E-83D2-2F482CE5AAB4",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 43,
    "tt_value": 12.9,
    "ttc_value": 12.9,
    "item_id": "42963146-5158-4666-8EE8-A71925481958",
    "user_id": null
  },
  {
    "id": "244A5EBE-3AA8-451F-8205-58EEF5720FFB",
    "transaction_type": "PURCHASE",
    "quantity": 5445,
    "tt_value": 217.8,
    "ttc_value": 222,
    "item_id": "068C9188-821C-4E74-9A54-F6C03C07333F",
    "user_id": null
  },
  {
    "id": "249EB1D0-6140-498A-A1B5-C33B130A9F39",
    "transaction_type": "PURCHASE",
    "quantity": 1242,
    "tt_value": 124.2,
    "ttc_value": 127,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "251F7A33-4D77-4307-BD35-4FA0F7E7D826",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 2,
    "tt_value": 1.56,
    "ttc_value": 1.56,
    "item_id": "A3D03363-7C95-4586-9449-DC3AFC6772CB",
    "user_id": null
  },
  {
    "id": "262D78DF-E5C4-4BFD-A77B-8B254DC2E959",
    "transaction_type": "PURCHASE",
    "quantity": 2000,
    "tt_value": 200,
    "ttc_value": 205,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "29745B36-1E54-4900-B3A0-576C59230EBB",
    "transaction_type": "PURCHASE",
    "quantity": 1091,
    "tt_value": 109.1,
    "ttc_value": 111,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "298BAE66-08D3-4C8E-A9C1-BFFFC80BAD56",
    "transaction_type": "PURCHASE",
    "quantity": 1914,
    "tt_value": 229.68,
    "ttc_value": 235,
    "item_id": "2B897E98-2235-4227-ACE4-D429BD172A7A",
    "user_id": null
  },
  {
    "id": "2A87F748-4B94-49CB-9850-B9DD417BB0DE",
    "transaction_type": "PURCHASE",
    "quantity": 350,
    "tt_value": 262.5,
    "ttc_value": 288,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "2CAFAABE-0B15-4034-BAD8-29AFEE8791E6",
    "transaction_type": "PURCHASE",
    "quantity": 365,
    "tt_value": 36.5,
    "ttc_value": 38,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "2D0CEDAC-DC88-4934-93E7-883351C29E06",
    "transaction_type": "PURCHASE",
    "quantity": 325,
    "tt_value": 243.75,
    "ttc_value": 253,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "2EA05D8E-5AFD-4515-B63D-AA8CABD0D167",
    "transaction_type": "PURCHASE",
    "quantity": 2242,
    "tt_value": 224.2,
    "ttc_value": 229,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "337E833B-3634-4D5B-9ECF-28210F754D00",
    "transaction_type": "PURCHASE",
    "quantity": 2686,
    "tt_value": 268.6,
    "ttc_value": 273,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "34D157C9-20CD-49EA-8697-53B237857092",
    "transaction_type": "PURCHASE",
    "quantity": 209,
    "tt_value": 108.68,
    "ttc_value": 115,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "35512F87-46F9-47B5-91C0-9CCA0EEC771B",
    "transaction_type": "PURCHASE",
    "quantity": 431,
    "tt_value": 224.12,
    "ttc_value": 232,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "358FCD41-476F-4431-8917-53A4DD699171",
    "transaction_type": "PURCHASE",
    "quantity": 1078,
    "tt_value": 129.36,
    "ttc_value": 131,
    "item_id": "2B897E98-2235-4227-ACE4-D429BD172A7A",
    "user_id": null
  },
  {
    "id": "39DE0A6E-8C4F-447C-AE7C-5ACCA96C8A0A",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 0.05,
    "ttc_value": 0.05,
    "item_id": "7E5312ED-E805-42F5-9113-3FFA1A4CCFF4",
    "user_id": null
  },
  {
    "id": "3A44D4E4-B520-4D50-BBD9-95C34448034E",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 0.1,
    "ttc_value": 0.1,
    "item_id": "319AD745-AE09-4AE3-8060-31DBE5FEB938",
    "user_id": null
  },
  {
    "id": "3B0A3AE2-61F7-4664-A40A-84A601838C37",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 2,
    "tt_value": 1.2,
    "ttc_value": 1.2,
    "item_id": "6C7B421B-766D-42C0-BD47-0FFEE94758BC",
    "user_id": null
  },
  {
    "id": "3C4A02BF-699B-4FEC-9D96-0E7B7197BD3B",
    "transaction_type": "PURCHASE",
    "quantity": 1615,
    "tt_value": 96.9,
    "ttc_value": 109,
    "item_id": "ED9F9E49-6929-430F-BDAF-F451B282FEC2",
    "user_id": null
  },
  {
    "id": "3D5D18A7-5B78-489C-BD2D-80ADF5DC0335",
    "transaction_type": "PURCHASE",
    "quantity": 500,
    "tt_value": 260,
    "ttc_value": 275,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "3D971897-9A7A-442E-94FB-B841C5050632",
    "transaction_type": "PURCHASE",
    "quantity": 300,
    "tt_value": 54,
    "ttc_value": 125,
    "item_id": "5FD0DE31-33A5-49F1-86D9-4E9C5945335A",
    "user_id": null
  },
  {
    "id": "3E5BCFD9-9E17-4004-889B-B91ADA401DC1",
    "transaction_type": "PURCHASE",
    "quantity": 203,
    "tt_value": 91.35,
    "ttc_value": 93,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "3FA44FC1-9A7D-4EE8-8F40-FC536682E33D",
    "transaction_type": "PURCHASE",
    "quantity": 282,
    "tt_value": 211.5,
    "ttc_value": 232,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "40CBF9E6-D761-4209-935F-CDA9C3A321E8",
    "transaction_type": "PURCHASE",
    "quantity": 1576,
    "tt_value": 378.24,
    "ttc_value": 388,
    "item_id": "39E70583-067C-4459-BFD4-1C50DB0A9BF0",
    "user_id": null
  },
  {
    "id": "428FAA80-F33C-4C42-8A8E-FB52B8DED07D",
    "transaction_type": "PURCHASE",
    "quantity": 324,
    "tt_value": 168.48,
    "ttc_value": 177,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "42BE78BE-1ED2-42E2-B41F-61084D807370",
    "transaction_type": "PURCHASE",
    "quantity": 500,
    "tt_value": 150,
    "ttc_value": 155,
    "item_id": "42963146-5158-4666-8EE8-A71925481958",
    "user_id": null
  },
  {
    "id": "450743BC-90F5-4162-B445-D1C02102FD91",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 19,
    "tt_value": 19,
    "ttc_value": 19,
    "item_id": "80E65225-F713-4E15-894C-6D716A9B285C",
    "user_id": null
  },
  {
    "id": "4522BCEC-6E43-47D1-9B0A-F5C1BF42F626",
    "transaction_type": "PURCHASE",
    "quantity": 500,
    "tt_value": 260,
    "ttc_value": 273,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "48C1420C-DE35-4DD9-B8E1-54E784C10EFC",
    "transaction_type": "PURCHASE",
    "quantity": 3144,
    "tt_value": 125.76,
    "ttc_value": 128,
    "item_id": "068C9188-821C-4E74-9A54-F6C03C07333F",
    "user_id": null
  },
  {
    "id": "4ADF2933-B439-44DE-B1EA-C14D21206B98",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 40,
    "tt_value": 20.8,
    "ttc_value": 20.8,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "4EC9DA4D-94FF-4EEB-99AC-A0CA05920D53",
    "transaction_type": "PURCHASE",
    "quantity": 248,
    "tt_value": 24.8,
    "ttc_value": 26,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "507C4A98-0658-48E9-A5E1-7DAFECB308A2",
    "transaction_type": "PURCHASE",
    "quantity": 209,
    "tt_value": 108.68,
    "ttc_value": 115,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "51407BFD-8F59-4141-A939-70F13A613BF4",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 175,
    "tt_value": 7,
    "ttc_value": 7,
    "item_id": "068C9188-821C-4E74-9A54-F6C03C07333F",
    "user_id": null
  },
  {
    "id": "519D6F41-4C27-425F-8D58-0887283B7F9F",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 0.01,
    "ttc_value": 0.01,
    "item_id": "7390CDC8-E582-4A75-8C98-C749B4FCF921",
    "user_id": null
  },
  {
    "id": "5265AFFC-8A65-45D7-96FB-EBFFD60DEEAD",
    "transaction_type": "PURCHASE",
    "quantity": 2250,
    "tt_value": 270,
    "ttc_value": 273,
    "item_id": "2B897E98-2235-4227-ACE4-D429BD172A7A",
    "user_id": null
  },
  {
    "id": "542BD67D-05F6-4D70-9B40-4625A77A53CC",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 0.3,
    "ttc_value": 0.3,
    "item_id": "03B89D02-D93A-4EEF-A17A-77A5EF46C2FB",
    "user_id": null
  },
  {
    "id": "55A395ED-DEA7-40D5-807C-D54C18DB45EA",
    "transaction_type": "PURCHASE",
    "quantity": 141,
    "tt_value": 105.75,
    "ttc_value": 116,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "56383396-3DC1-49C2-A27D-97D2AB0B4B09",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 0.02,
    "ttc_value": 0.02,
    "item_id": "108B9D9D-D43E-4B2A-9C1E-B9BC25B87B14",
    "user_id": null
  },
  {
    "id": "57B9B9FC-A30D-45ED-89F9-B651D2266627",
    "transaction_type": "PURCHASE",
    "quantity": 2497,
    "tt_value": 149.82,
    "ttc_value": 164,
    "item_id": "ED9F9E49-6929-430F-BDAF-F451B282FEC2",
    "user_id": null
  },
  {
    "id": "59759ACC-16A6-4195-AEEC-811DA6F79C60",
    "transaction_type": "PURCHASE",
    "quantity": 806,
    "tt_value": 193.44,
    "ttc_value": 202,
    "item_id": "39E70583-067C-4459-BFD4-1C50DB0A9BF0",
    "user_id": null
  },
  {
    "id": "5B753A3C-EF1A-4B30-AA70-F79BBD4A5181",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 23,
    "tt_value": 13.8,
    "ttc_value": 13.8,
    "item_id": "AEB8CB99-D0D6-4A61-AA51-FBDBB523B35E",
    "user_id": null
  },
  {
    "id": "5C2BED50-23ED-452D-9EF2-9AC4F7060750",
    "transaction_type": "PURCHASE",
    "quantity": 249,
    "tt_value": 44.82,
    "ttc_value": 105,
    "item_id": "5FD0DE31-33A5-49F1-86D9-4E9C5945335A",
    "user_id": null
  },
  {
    "id": "60F72CB8-C1D7-48BF-A483-2F3AA01BE0E5",
    "transaction_type": "PURCHASE",
    "quantity": 1830,
    "tt_value": 219.6,
    "ttc_value": 223,
    "item_id": "2B897E98-2235-4227-ACE4-D429BD172A7A",
    "user_id": null
  },
  {
    "id": "65DC3A1B-1583-4A88-8E82-AE930DDA338A",
    "transaction_type": "PURCHASE",
    "quantity": 766,
    "tt_value": 344.7,
    "ttc_value": 352,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "65F7BFD1-A159-46E8-B041-15E2A0661CBE",
    "transaction_type": "PURCHASE",
    "quantity": 5000,
    "tt_value": 300,
    "ttc_value": 333,
    "item_id": "ED9F9E49-6929-430F-BDAF-F451B282FEC2",
    "user_id": null
  },
  {
    "id": "678A1FF9-8F98-43A4-B4B8-C195B075DF19",
    "transaction_type": "PURCHASE",
    "quantity": 1000,
    "tt_value": 120,
    "ttc_value": 123,
    "item_id": "2B897E98-2235-4227-ACE4-D429BD172A7A",
    "user_id": null
  },
  {
    "id": "68869110-CC4D-41F1-B231-FC8B750D8239",
    "transaction_type": "PURCHASE",
    "quantity": 394,
    "tt_value": 204.88,
    "ttc_value": 231,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "68F3D5D4-10AC-433C-A38B-70592D7D234D",
    "transaction_type": "PURCHASE",
    "quantity": 491,
    "tt_value": 255.32,
    "ttc_value": 265,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "6A1D4DCD-2A5F-463F-A507-79419DD8D76A",
    "transaction_type": "PURCHASE",
    "quantity": 576,
    "tt_value": 138.24,
    "ttc_value": 146,
    "item_id": "39E70583-067C-4459-BFD4-1C50DB0A9BF0",
    "user_id": null
  },
  {
    "id": "6ADD559E-66B0-42FB-BA4A-019BB9AAC536",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 9,
    "tt_value": 5.4,
    "ttc_value": 5.4,
    "item_id": "AEB8CB99-D0D6-4A61-AA51-FBDBB523B35E",
    "user_id": null
  },
  {
    "id": "6ADEE89E-83BB-4044-A153-B288099A5CA8",
    "transaction_type": "PURCHASE",
    "quantity": 2699,
    "tt_value": 269.9,
    "ttc_value": 277,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "6B6E8C58-0B43-46F0-9A00-EDC174E1BF8D",
    "transaction_type": "PURCHASE",
    "quantity": 569,
    "tt_value": 426.75,
    "ttc_value": 463,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "6D12737F-1DC4-4BFF-BABF-6C2AE394F84B",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 2,
    "tt_value": 3,
    "ttc_value": 3,
    "item_id": "E1F378FA-2756-4A60-AA88-E667E581FE87",
    "user_id": null
  },
  {
    "id": "6D9F4FAD-B08B-4FA0-93E7-4ED832CC3F7A",
    "transaction_type": "PURCHASE",
    "quantity": 5665,
    "tt_value": 169.95,
    "ttc_value": 177,
    "item_id": "F9A28E31-AA19-419F-B2FD-02C3882EF13C",
    "user_id": null
  },
  {
    "id": "707452CA-E62D-4C35-88A8-023ACFB96CB5",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1512,
    "tt_value": 15.12,
    "ttc_value": 15.12,
    "item_id": "C44F97A4-8A32-4831-8018-FB882BA5F8BE",
    "user_id": null
  },
  {
    "id": "7127F844-27A5-4353-AE52-5799CC035653",
    "transaction_type": "PURCHASE",
    "quantity": 5779,
    "tt_value": 346.74,
    "ttc_value": 388,
    "item_id": "ED9F9E49-6929-430F-BDAF-F451B282FEC2",
    "user_id": null
  },
  {
    "id": "71F0D2B8-AE92-4DB8-A797-8194DF380058",
    "transaction_type": "PURCHASE",
    "quantity": 509,
    "tt_value": 229.05,
    "ttc_value": 235,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "72A345A4-A799-45AC-B4EF-A7F45104D333",
    "transaction_type": "PURCHASE",
    "quantity": 128,
    "tt_value": 96,
    "ttc_value": 101,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "733D475F-6AE2-48A2-A511-8CED5B89C6D2",
    "transaction_type": "PURCHASE",
    "quantity": 1000,
    "tt_value": 450,
    "ttc_value": 456,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "736EC6F4-2AF9-4092-801D-91A7DAB264F7",
    "transaction_type": "PURCHASE",
    "quantity": 500,
    "tt_value": 260,
    "ttc_value": 273,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "756B6FF2-AA19-4271-9C56-AAE72D492241",
    "transaction_type": "PURCHASE",
    "quantity": 800,
    "tt_value": 192,
    "ttc_value": 212,
    "item_id": "39E70583-067C-4459-BFD4-1C50DB0A9BF0",
    "user_id": null
  },
  {
    "id": "75AC72A9-1A38-42A3-8C0A-99DCCFBA8542",
    "transaction_type": "PURCHASE",
    "quantity": 293,
    "tt_value": 152.36,
    "ttc_value": 159,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "7663B7E5-6DC6-469B-9E21-FD63062F18A8",
    "transaction_type": "PURCHASE",
    "quantity": 5001,
    "tt_value": 100.02,
    "ttc_value": 102,
    "item_id": "4E4F11B9-FCE3-4122-9505-EEFFBB49C2C4",
    "user_id": null
  },
  {
    "id": "7B6955E2-39FD-45EA-90BF-FFC03BDAFDB8",
    "transaction_type": "PURCHASE",
    "quantity": 744,
    "tt_value": 334.8,
    "ttc_value": 338,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "7CD6A14A-D61D-4404-8BAD-7112C28A2354",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 48,
    "tt_value": 24,
    "ttc_value": 24,
    "item_id": "3D869176-06A5-4399-B37F-82E229E1522E",
    "user_id": null
  },
  {
    "id": "7E30A44C-A1F1-4E5D-99D5-633F0DE2C91B",
    "transaction_type": "PURCHASE",
    "quantity": 444,
    "tt_value": 230.88,
    "ttc_value": 250,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "7E9B7CC1-B709-4A60-88ED-6500700CD75C",
    "transaction_type": "PURCHASE",
    "quantity": 3034,
    "tt_value": 182.04,
    "ttc_value": 197,
    "item_id": "ED9F9E49-6929-430F-BDAF-F451B282FEC2",
    "user_id": null
  },
  {
    "id": "812ED00C-26E1-46F4-ADC9-19516621484F",
    "transaction_type": "PURCHASE",
    "quantity": 8940,
    "tt_value": 268.2,
    "ttc_value": 275,
    "item_id": "F9A28E31-AA19-419F-B2FD-02C3882EF13C",
    "user_id": null
  },
  {
    "id": "84160E50-178C-40EC-BB34-F34C471F5BEA",
    "transaction_type": "PURCHASE",
    "quantity": 193,
    "tt_value": 144.75,
    "ttc_value": 156,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "8459D41C-BB97-49F1-9F8A-B156811D6C17",
    "transaction_type": "PURCHASE",
    "quantity": 1183,
    "tt_value": 532.35,
    "ttc_value": 539,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "849260FD-F03F-459D-8AD0-328D41F8474E",
    "transaction_type": "PURCHASE",
    "quantity": 4806,
    "tt_value": 96.12,
    "ttc_value": 98,
    "item_id": "4E4F11B9-FCE3-4122-9505-EEFFBB49C2C4",
    "user_id": null
  },
  {
    "id": "85F438AE-BE24-47BD-BAE7-C3CAF995FE5E",
    "transaction_type": "PURCHASE",
    "quantity": 1000,
    "tt_value": 520,
    "ttc_value": 547,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "8CD646B8-08EF-485E-A4F7-7D657EB5561F",
    "transaction_type": "PURCHASE",
    "quantity": 2927,
    "tt_value": 175.62,
    "ttc_value": 193,
    "item_id": "ED9F9E49-6929-430F-BDAF-F451B282FEC2",
    "user_id": null
  },
  {
    "id": "8F9B3A1B-3DE1-463F-B313-D15DAAE02E19",
    "transaction_type": "PURCHASE",
    "quantity": 1762,
    "tt_value": 422.88,
    "ttc_value": 450,
    "item_id": "39E70583-067C-4459-BFD4-1C50DB0A9BF0",
    "user_id": null
  },
  {
    "id": "92E19FFE-D85A-494D-8882-D16769CC9A1E",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 0.26,
    "ttc_value": 0.26,
    "item_id": "7A07DE34-6791-496C-A042-94F3153B68A3",
    "user_id": null
  },
  {
    "id": "96880736-71E6-4E33-B426-00343D832E4B",
    "transaction_type": "PURCHASE",
    "quantity": 85,
    "tt_value": 63.75,
    "ttc_value": 67,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "969A8609-B7C9-4AD3-98F6-0D46DDCE7410",
    "transaction_type": "PURCHASE",
    "quantity": 160,
    "tt_value": 83.2,
    "ttc_value": 88,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "97B9D74B-8AAC-435C-AEBC-CAB359A7A12F",
    "transaction_type": "PURCHASE",
    "quantity": 266,
    "tt_value": 199.5,
    "ttc_value": 220,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "9872372B-C8F1-4BED-83FB-DC32E6FDB2A7",
    "transaction_type": "PURCHASE",
    "quantity": 651,
    "tt_value": 292.95,
    "ttc_value": 305,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "9ADFE32F-6660-497E-878E-51892853FA3F",
    "transaction_type": "PURCHASE",
    "quantity": 3087,
    "tt_value": 308.7,
    "ttc_value": 320,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "9DE3C0AA-F649-49B0-91B0-549E2D3E4D97",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 1,
    "ttc_value": 1,
    "item_id": "80E65225-F713-4E15-894C-6D716A9B285C",
    "user_id": null
  },
  {
    "id": "9E265CB4-D147-452B-A5C3-060F624FB096",
    "transaction_type": "PURCHASE",
    "quantity": 6005,
    "tt_value": 360.3,
    "ttc_value": 396,
    "item_id": "ED9F9E49-6929-430F-BDAF-F451B282FEC2",
    "user_id": null
  },
  {
    "id": "A00EDBBC-BD17-4814-9BA3-00550BA6E084",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 0.39,
    "ttc_value": 0.39,
    "item_id": "79957C0A-8CFD-4F57-BCC2-4FEF5CD7DCB2",
    "user_id": null
  },
  {
    "id": "A09F5F77-3006-41AE-91A2-1A43BA974206",
    "transaction_type": "PURCHASE",
    "quantity": 1000,
    "tt_value": 300,
    "ttc_value": 308,
    "item_id": "42963146-5158-4666-8EE8-A71925481958",
    "user_id": null
  },
  {
    "id": "A0B7C8FE-79D6-405A-B3E9-342C0B346AD6",
    "transaction_type": "PURCHASE",
    "quantity": 330,
    "tt_value": 171.6,
    "ttc_value": 181,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "A246F925-9892-42EA-822B-46A214FC25FA",
    "transaction_type": "PURCHASE",
    "quantity": 1501,
    "tt_value": 180.12,
    "ttc_value": 182,
    "item_id": "2B897E98-2235-4227-ACE4-D429BD172A7A",
    "user_id": null
  },
  {
    "id": "A2B62532-39F8-4C28-9870-08A4226AEE4F",
    "transaction_type": "PURCHASE",
    "quantity": 1375,
    "tt_value": 137.5,
    "ttc_value": 141,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "A4F6CB35-AFA4-484E-B40D-FB08AB0B7CE1",
    "transaction_type": "PURCHASE",
    "quantity": 10000,
    "tt_value": 400,
    "ttc_value": 406,
    "item_id": "068C9188-821C-4E74-9A54-F6C03C07333F",
    "user_id": null
  },
  {
    "id": "AB88FE70-A48A-48A2-85D7-5182B526A3E6",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 323,
    "tt_value": 32.3,
    "ttc_value": 32.3,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "AC4236B6-C97E-4BE0-B7CF-D73C9B9052F9",
    "transaction_type": "PURCHASE",
    "quantity": 300,
    "tt_value": 156,
    "ttc_value": 164,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "AF27A8F9-34E5-424D-8043-D008713CC09B",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 0.4,
    "ttc_value": 0.4,
    "item_id": "BB15856C-EEF3-4433-AD80-66E9756E9F58",
    "user_id": null
  },
  {
    "id": "B00EC948-D814-4E24-9AB2-D6FBE80A4B1D",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 46,
    "tt_value": 9.2,
    "ttc_value": 9.2,
    "item_id": "5E0842B2-BE93-478B-ABA9-21D1D4E4E66D",
    "user_id": null
  },
  {
    "id": "B0AB23BE-CE14-4FB7-994D-8B2E1B4F5E93",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 30,
    "tt_value": 11.4,
    "ttc_value": 11.4,
    "item_id": "D928A001-5B14-4185-A79C-BE5BE7BC7601",
    "user_id": null
  },
  {
    "id": "B22C8ABC-4B04-402A-A5B7-06FD2624273F",
    "transaction_type": "PURCHASE",
    "quantity": 1000,
    "tt_value": 120,
    "ttc_value": 127,
    "item_id": "2B897E98-2235-4227-ACE4-D429BD172A7A",
    "user_id": null
  },
  {
    "id": "B24FFC00-FC3B-49B6-933D-C2EF23534A4A",
    "transaction_type": "PURCHASE",
    "quantity": 916,
    "tt_value": 109.92,
    "ttc_value": 113,
    "item_id": "2B897E98-2235-4227-ACE4-D429BD172A7A",
    "user_id": null
  },
  {
    "id": "B5529357-6DE2-4361-B086-8E96D58C5407",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 0.5,
    "ttc_value": 0.5,
    "item_id": "0EA3DFA7-A97B-454C-B8C8-2EC4EF9EC505",
    "user_id": null
  },
  {
    "id": "B5D8C81B-B4B5-4B5B-9193-55D025C4F112",
    "transaction_type": "PURCHASE",
    "quantity": 7216,
    "tt_value": 432.96,
    "ttc_value": 468,
    "item_id": "ED9F9E49-6929-430F-BDAF-F451B282FEC2",
    "user_id": null
  },
  {
    "id": "B5FF599C-CDE3-4AD8-8AAA-02B5E2AEEBFC",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 2066,
    "tt_value": 20.66,
    "ttc_value": 20.66,
    "item_id": "8995639F-8E2B-463D-9998-D5AD6A928FCA",
    "user_id": null
  },
  {
    "id": "BAB14ADD-9F9A-484A-8B1C-65657FC03DDF",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 9,
    "tt_value": 4.68,
    "ttc_value": 4.68,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "BB05DE25-603D-4F7F-8090-EEAAED62C76D",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 22,
    "tt_value": 17.6,
    "ttc_value": 17.6,
    "item_id": "45D00F11-6461-4ADB-8A58-4CE8A7A066C7",
    "user_id": null
  },
  {
    "id": "BD2CEE6D-6BE6-4342-810A-1EEBF43BAE6F",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 20,
    "tt_value": 15.6,
    "ttc_value": 15.6,
    "item_id": "A3D03363-7C95-4586-9449-DC3AFC6772CB",
    "user_id": null
  },
  {
    "id": "BE1DF500-A749-474A-AF96-9BC2AD48676A",
    "transaction_type": "PURCHASE",
    "quantity": 3001,
    "tt_value": 90.03,
    "ttc_value": 93,
    "item_id": "F9A28E31-AA19-419F-B2FD-02C3882EF13C",
    "user_id": null
  },
  {
    "id": "BEA8B979-C4EE-42F0-9319-313558FC341F",
    "transaction_type": "PURCHASE",
    "quantity": 106,
    "tt_value": 55.12,
    "ttc_value": 60,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "C3085ADD-8224-4E1C-ADE6-5E30B34666E1",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 5750,
    "tt_value": 115,
    "ttc_value": 115,
    "item_id": "4E4F11B9-FCE3-4122-9505-EEFFBB49C2C4",
    "user_id": null
  },
  {
    "id": "C5534B34-6704-4277-A91C-934EF8BB5676",
    "transaction_type": "PURCHASE",
    "quantity": 9000,
    "tt_value": 180,
    "ttc_value": 188,
    "item_id": "4E4F11B9-FCE3-4122-9505-EEFFBB49C2C4",
    "user_id": null
  },
  {
    "id": "C5CE02AB-0C41-40E3-A7E4-BDDA73FCD7F5",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 15,
    "tt_value": 9.6,
    "ttc_value": 9.6,
    "item_id": "F5A6CCC2-B5D8-4065-B8BE-D145CC30AEF4",
    "user_id": null
  },
  {
    "id": "C6AA709C-D13A-4E61-B738-0DF3F7AB3649",
    "transaction_type": "PURCHASE",
    "quantity": 320,
    "tt_value": 240,
    "ttc_value": 263,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "C7D9293D-99DE-4828-9E40-53D22EB816F6",
    "transaction_type": "PURCHASE",
    "quantity": 805,
    "tt_value": 193.2,
    "ttc_value": 203,
    "item_id": "39E70583-067C-4459-BFD4-1C50DB0A9BF0",
    "user_id": null
  },
  {
    "id": "C8A1B43D-7B46-4E56-95BB-59F2F0C2E674",
    "transaction_type": "PURCHASE",
    "quantity": 360,
    "tt_value": 162,
    "ttc_value": 165,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "CEA57EB1-66B9-4CFE-BA00-1070707D3DB9",
    "transaction_type": "PURCHASE",
    "quantity": 300,
    "tt_value": 225,
    "ttc_value": 248,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "CEE9E26C-BB32-4DB2-8FD3-3932720E85FD",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 243,
    "tt_value": 24.3,
    "ttc_value": 24.3,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "D03937C9-38A6-4977-A1C2-DC20CAF0F435",
    "transaction_type": "PURCHASE",
    "quantity": 202,
    "tt_value": 151.5,
    "ttc_value": 157,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "D08EAAB5-41FE-483F-9327-62CDBF987832",
    "transaction_type": "PURCHASE",
    "quantity": 1000,
    "tt_value": 300,
    "ttc_value": 308,
    "item_id": "42963146-5158-4666-8EE8-A71925481958",
    "user_id": null
  },
  {
    "id": "D0D821BE-1607-4555-9AAA-AC0476C0D949",
    "transaction_type": "PURCHASE",
    "quantity": 1175,
    "tt_value": 282,
    "ttc_value": 297,
    "item_id": "39E70583-067C-4459-BFD4-1C50DB0A9BF0",
    "user_id": null
  },
  {
    "id": "D0DE1095-3802-497F-A3F7-5A59195ED3E9",
    "transaction_type": "PURCHASE",
    "quantity": 100,
    "tt_value": 18,
    "ttc_value": 42,
    "item_id": "5FD0DE31-33A5-49F1-86D9-4E9C5945335A",
    "user_id": null
  },
  {
    "id": "DABF6FF2-166C-4125-8EA4-68F93B882A82",
    "transaction_type": "PURCHASE",
    "quantity": 300,
    "tt_value": 225,
    "ttc_value": 237,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "DB665143-D83F-452C-8B8A-6FC4EAEE4040",
    "transaction_type": "PURCHASE",
    "quantity": 267,
    "tt_value": 200.25,
    "ttc_value": 223,
    "item_id": "19550156-5630-4BF9-8AFA-827ACC250A2C",
    "user_id": null
  },
  {
    "id": "DCB32439-29D8-4A3F-8AEE-64D3E77C4EAA",
    "transaction_type": "PURCHASE",
    "quantity": 3914,
    "tt_value": 469.68,
    "ttc_value": 475,
    "item_id": "2B897E98-2235-4227-ACE4-D429BD172A7A",
    "user_id": null
  },
  {
    "id": "DE9D4B92-F135-48A3-8111-57EE906C9296",
    "transaction_type": "PURCHASE",
    "quantity": 1001,
    "tt_value": 450.45,
    "ttc_value": 454,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "DFE06F00-08DC-4691-BAE7-C12BB3EFBDEA",
    "transaction_type": "PURCHASE",
    "quantity": 317,
    "tt_value": 164.84,
    "ttc_value": 173,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "E0340D08-1F9B-4472-91CC-89EF94B3C908",
    "transaction_type": "PURCHASE",
    "quantity": 1500,
    "tt_value": 675,
    "ttc_value": 682,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "E0C36729-E724-4ABB-915F-365F97256D49",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 18,
    "tt_value": 9.36,
    "ttc_value": 9.36,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "E3655393-10F5-4006-B73D-E6F9A342C60A",
    "transaction_type": "PURCHASE",
    "quantity": 1005,
    "tt_value": 100.5,
    "ttc_value": 103,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "E5EE219D-FCD9-4839-819A-9F16825346F3",
    "transaction_type": "PURCHASE",
    "quantity": 3527,
    "tt_value": 141.08,
    "ttc_value": 145,
    "item_id": "068C9188-821C-4E74-9A54-F6C03C07333F",
    "user_id": null
  },
  {
    "id": "E6C91992-7B63-4C71-9AFB-6488E3896554",
    "transaction_type": "PURCHASE",
    "quantity": 846,
    "tt_value": 380.7,
    "ttc_value": 386,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "E79B87F4-6B08-45D0-A0F0-85FCC2EF0DF1",
    "transaction_type": "PURCHASE",
    "quantity": 2528,
    "tt_value": 303.36,
    "ttc_value": 307,
    "item_id": "2B897E98-2235-4227-ACE4-D429BD172A7A",
    "user_id": null
  },
  {
    "id": "E812D509-04E3-4B5A-923F-1BACF34E1FA4",
    "transaction_type": "PURCHASE",
    "quantity": 80,
    "tt_value": 41.6,
    "ttc_value": 44,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "E834107B-9F2B-4D81-BEB7-23378C3584BB",
    "transaction_type": "PURCHASE",
    "quantity": 5530,
    "tt_value": 221.2,
    "ttc_value": 225,
    "item_id": "068C9188-821C-4E74-9A54-F6C03C07333F",
    "user_id": null
  },
  {
    "id": "E8FE2A9F-D6AC-49EC-B611-771ECDC690E5",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 5,
    "tt_value": 0.1,
    "ttc_value": 0.1,
    "item_id": "31E5BC77-F0A9-4415-88AF-1738F439876B",
    "user_id": null
  },
  {
    "id": "EB6CCC48-A10B-4DFF-BABA-78D5E3FA2F7F",
    "transaction_type": "PURCHASE",
    "quantity": 2233,
    "tt_value": 133.98,
    "ttc_value": 145,
    "item_id": "ED9F9E49-6929-430F-BDAF-F451B282FEC2",
    "user_id": null
  },
  {
    "id": "ED411212-038F-47D1-9F82-25FC9AE1A115",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 0.75,
    "ttc_value": 0.75,
    "item_id": "FB0BEBAC-5822-4EAB-B94B-4FD799463687",
    "user_id": null
  },
  {
    "id": "F07825BC-0577-4962-8A1B-243CCDBC1CC4",
    "transaction_type": "PURCHASE",
    "quantity": 242,
    "tt_value": 125.84,
    "ttc_value": 141,
    "item_id": "F1D4CD79-3570-4731-8700-12762DB79BC8",
    "user_id": null
  },
  {
    "id": "F3EB5C67-D5D0-4198-BC89-4410851AE4ED",
    "transaction_type": "PURCHASE",
    "quantity": 2018,
    "tt_value": 201.8,
    "ttc_value": 207,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "F5305BA3-CEEF-477D-A1DC-412756D9F5C7",
    "transaction_type": "PURCHASE",
    "quantity": 778,
    "tt_value": 350.1,
    "ttc_value": 354,
    "item_id": "88E50467-C0B5-4E15-827A-D954086C9D91",
    "user_id": null
  },
  {
    "id": "F6454A84-D7A2-4173-8E63-1DE761A5E1D2",
    "transaction_type": "PURCHASE",
    "quantity": 2575,
    "tt_value": 257.5,
    "ttc_value": 267,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "F647EB1E-31C4-4495-80F1-78244D223931",
    "transaction_type": "PURCHASE",
    "quantity": 438,
    "tt_value": 43.8,
    "ttc_value": 45,
    "item_id": "F85D331F-07D0-4C8B-99C0-F1FC003D67B8",
    "user_id": null
  },
  {
    "id": "F84B6659-6E50-4240-9139-FA798D915626",
    "transaction_type": "EXISTING_STOCK",
    "quantity": 1,
    "tt_value": 0.63,
    "ttc_value": 0.63,
    "item_id": "6DA65536-6BBC-444D-8A1F-E26CFB761BBA",
    "user_id": null
  },
  {
    "id": "FDC52186-59E9-4C85-B4AE-96BB88A22337",
    "transaction_type": "PURCHASE",
    "quantity": 2513,
    "tt_value": 100.52,
    "ttc_value": 103,
    "item_id": "068C9188-821C-4E74-9A54-F6C03C07333F",
    "user_id": null
  }
];

/**
 * Sessions trade generees depuis les transactions d'entree.
 * Convention d'hydratation:
 * - 1 transaction IN -> 1 session TRADE
 * - session.id = `TRADE-${transaction.id}`
 */
export const SESSIONS_TRADE: Prisma.SessionCreateManyInput[] = TRADE_IN_TRANSACTIONS.map((tx) => ({
  id: `TRADE-${tx.id}`,
  cost_tt: tx.tt_value,
  cost_ttc: tx.ttc_value,
  win_tt: 0,
  win_ttc: 0,
  session_type: 'TRADE',
  clics: 0,
  status: 'OPENNED',
  user_id: tx.user_id ?? SYSTEM_USER_ID,
}));

/**
 * Lignes trade d'entree generees depuis les transactions d'entree.
 * Convention d'hydratation:
 * - line.id = transaction.id (important pour compatibilite inventory_lot_transaction)
 * - line_type = IN
 * - sale_status = null (pas une vente)
 */
export const SESSION_TRADE_LINES: Prisma.SessionLineCreateManyInput[] = TRADE_IN_TRANSACTIONS.map(
  (tx) => ({
    id: tx.id,
    session_id: `TRADE-${tx.id}`,
    item_id: tx.item_id,
    quantity: tx.quantity,
    line_type: 'IN',
    line_status: 'OPENNED',
    sale_status: null,
    tt: tx.tt_value,
    ttc: tx.ttc_value,
    user_id: tx.user_id ?? SYSTEM_USER_ID,
  })
);
