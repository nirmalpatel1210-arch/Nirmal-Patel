import { ServiceType } from '../types';

export interface BillerItem {
  id: string;
  name: string;
  category: ServiceType | string;
  state?: string;
  paramName: string;
  paramPlaceholder: string;
  paramRegex?: RegExp;
}

export const BBPS_CATEGORIES = [
  { id: 'ELECTRICITY', name: 'Electricity', icon: 'Zap' },
  { id: 'CREDIT_CARD', name: 'Credit Card Bill', icon: 'CreditCard' },
  { id: 'GAS', name: 'Piped Gas & Cylinders', icon: 'Flame' },
  { id: 'WATER', name: 'Water Municipal', icon: 'Droplets' },
  { id: 'MOBILE_RECHARGE', name: 'Mobile Recharge', icon: 'Smartphone' },
  { id: 'DTH', name: 'DTH Cable TV', icon: 'Tv' },
  { id: 'FASTAG', name: 'FASTag Toll', icon: 'Car' },
  { id: 'INSURANCE', name: 'Life & General Insurance', icon: 'ShieldCheck' },
  { id: 'POSTPAID', name: 'Mobile Postpaid', icon: 'PhoneCall' },
  { id: 'BROADBAND', name: 'Broadband / Internet', icon: 'Wifi' },
  { id: 'LANDLINE', name: 'Landline Phone', icon: 'Phone' },
];

export const BILLERS_DATABASE: Record<string, BillerItem[]> = {
  ELECTRICITY: [
    { id: 'TORRENT_AHM', name: 'Torrent Power - Ahmedabad & Gandhinagar', category: 'ELECTRICITY', state: 'Gujarat', paramName: 'Service Number', paramPlaceholder: 'e.g. 40918231' },
    { id: 'TORRENT_SUR', name: 'Torrent Power - Surat', category: 'ELECTRICITY', state: 'Gujarat', paramName: 'Service Number', paramPlaceholder: 'e.g. 50918244' },
    { id: 'UGVCL', name: 'Uttar Gujarat Vij Company Ltd (UGVCL)', category: 'ELECTRICITY', state: 'Gujarat', paramName: 'Consumer Number', paramPlaceholder: '11-digit Consumer ID' },
    { id: 'DGVCL', name: 'Dakshin Gujarat Vij Company Ltd (DGVCL)', category: 'ELECTRICITY', state: 'Gujarat', paramName: 'Consumer Number', paramPlaceholder: '11-digit Consumer ID' },
    { id: 'MGVCL', name: 'Madhya Gujarat Vij Company Ltd (MGVCL)', category: 'ELECTRICITY', state: 'Gujarat', paramName: 'Consumer Number', paramPlaceholder: '11-digit Consumer ID' },
    { id: 'PGVCL', name: 'Paschim Gujarat Vij Company Ltd (PGVCL)', category: 'ELECTRICITY', state: 'Gujarat', paramName: 'Consumer Number', paramPlaceholder: '11-digit Consumer ID' },
    { id: 'BESCOM', name: 'BESCOM - Bengaluru Electricity', category: 'ELECTRICITY', state: 'Karnataka', paramName: 'Account ID', paramPlaceholder: '10-digit Account ID' },
    { id: 'TATA_MUM', name: 'Tata Power - Mumbai', category: 'ELECTRICITY', state: 'Maharashtra', paramName: 'Consumer Number', paramPlaceholder: '12-digit Consumer No' },
    { id: 'ADANI_MUM', name: 'Adani Electricity - Mumbai', category: 'ELECTRICITY', state: 'Maharashtra', paramName: 'Consumer Number', paramPlaceholder: '9-digit Consumer No' },
  ],
  GAS: [
    { id: 'ADANI_GAS', name: 'Adani Total Gas Limited', category: 'GAS', paramName: 'Customer ID', paramPlaceholder: 'e.g. 20019283' },
    { id: 'GUJARAT_GAS', name: 'Gujarat Gas Company Limited', category: 'GAS', paramName: 'Customer ID', paramPlaceholder: 'e.g. 10928341' },
    { id: 'SABARMATI_GAS', name: 'Sabarmati Gas Ltd', category: 'GAS', paramName: 'BP Number', paramPlaceholder: 'e.g. 5001928' },
    { id: 'IGL', name: 'Indraprastha Gas Limited (IGL)', category: 'GAS', paramName: 'BP Number', paramPlaceholder: 'e.g. 4001928' },
    { id: 'MGL', name: 'Mahanagar Gas Limited (MGL)', category: 'GAS', paramName: 'CA Number', paramPlaceholder: 'e.g. 1290312' },
  ],
  WATER: [
    { id: 'AMC_WATER', name: 'Ahmedabad Municipal Corporation (Water & Sewerage)', category: 'WATER', state: 'Gujarat', paramName: 'Tenement / Consumer No', paramPlaceholder: 'e.g. 0102030405' },
    { id: 'SMC_WATER', name: 'Surat Municipal Corporation Water Dept', category: 'WATER', state: 'Gujarat', paramName: 'Consumer ID', paramPlaceholder: 'e.g. 991823' },
    { id: 'DJB_WATER', name: 'Delhi Jal Board', category: 'WATER', state: 'Delhi', paramName: 'K Number', paramPlaceholder: '10-digit K Number' },
    { id: 'BWSSB_WATER', name: 'Bangalore Water Supply (BWSSB)', category: 'WATER', state: 'Karnataka', paramName: 'Consumer ID', paramPlaceholder: 'e.g. 881923' },
  ],
  INSURANCE: [
    { id: 'LIC_INDIA', name: 'Life Insurance Corporation of India (LIC)', category: 'INSURANCE', paramName: 'Policy Number', paramPlaceholder: '9-digit Policy Number' },
    { id: 'HDFC_LIFE', name: 'HDFC Life Insurance', category: 'INSURANCE', paramName: 'Policy Number', paramPlaceholder: '8-digit Policy Number' },
    { id: 'SBI_LIFE', name: 'SBI Life Insurance Co Ltd', category: 'INSURANCE', paramName: 'Policy Number', paramPlaceholder: 'Policy / Proposal ID' },
    { id: 'ICICI_PRU', name: 'ICICI Prudential Life Insurance', category: 'INSURANCE', paramName: 'Policy Number', paramPlaceholder: '8-digit Policy Number' },
    { id: 'MAX_LIFE', name: 'Max Life Insurance', category: 'INSURANCE', paramName: 'Policy Number', paramPlaceholder: 'Policy Number' },
  ],
  FASTAG: [
    { id: 'ICICI_FASTAG', name: 'ICICI Bank FASTag', category: 'FASTAG', paramName: 'Vehicle VRN', paramPlaceholder: 'e.g. GJ01KM8821' },
    { id: 'SBI_FASTAG', name: 'State Bank of India FASTag', category: 'FASTAG', paramName: 'Vehicle Number', paramPlaceholder: 'e.g. GJ27AB1234' },
    { id: 'PAYTM_FASTAG', name: 'Paytm Payments Bank FASTag', category: 'FASTAG', paramName: 'Vehicle Number', paramPlaceholder: 'e.g. DL01AB9999' },
    { id: 'HDFC_FASTAG', name: 'HDFC Bank FASTag', category: 'FASTAG', paramName: 'Vehicle Number', paramPlaceholder: 'e.g. MH02CD5555' },
    { id: 'KOTAK_FASTAG', name: 'Kotak Mahindra FASTag', category: 'FASTAG', paramName: 'Vehicle Number', paramPlaceholder: 'e.g. RJ14XY7890' },
  ],
  POSTPAID: [
    { id: 'AIRTEL_POST', name: 'Airtel Postpaid', category: 'POSTPAID', paramName: 'Mobile Number', paramPlaceholder: '10-digit Mobile No' },
    { id: 'JIO_POST', name: 'Jio Postpaid Plus', category: 'POSTPAID', paramName: 'Mobile Number', paramPlaceholder: '10-digit Mobile No' },
    { id: 'VI_POST', name: 'Vi (Vodafone Idea) Postpaid', category: 'POSTPAID', paramName: 'Mobile Number', paramPlaceholder: '10-digit Mobile No' },
    { id: 'BSNL_POST', name: 'BSNL Postpaid Mobile', category: 'POSTPAID', paramName: 'Account Number', paramPlaceholder: 'Account ID' },
  ],
  BROADBAND: [
    { id: 'AIRTEL_FIBER', name: 'Airtel Xstream Fiber Broadband', category: 'BROADBAND', paramName: 'Landline / DSL ID', paramPlaceholder: '079XXXXXXXX' },
    { id: 'JIO_FIBER', name: 'JioFiber Fixed Broadband', category: 'BROADBAND', paramName: 'Service ID / Mobile', paramPlaceholder: 'Fixed Line No' },
    { id: 'GTPL_BB', name: 'GTPL Broadband Ahmedabad', category: 'BROADBAND', paramName: 'Customer ID', paramPlaceholder: 'e.g. GTPL88192' },
    { id: 'ACT_FIBER', name: 'ACT Fibernet', category: 'BROADBAND', paramName: 'Account No', paramPlaceholder: 'User Account' },
  ],
};

export const CREDIT_CARD_ISSUERS = [
  { id: 'HDFC', name: 'HDFC Bank Credit Card', minDuePct: 0.05, logoColor: '#004c8f' },
  { id: 'SBI', name: 'SBI Card (State Bank of India)', minDuePct: 0.05, logoColor: '#1d71b8' },
  { id: 'ICICI', name: 'ICICI Bank Credit Card', minDuePct: 0.05, logoColor: '#a62424' },
  { id: 'AXIS', name: 'Axis Bank Credit Card', minDuePct: 0.05, logoColor: '#97144d' },
  { id: 'KOTAK', name: 'Kotak Mahindra Bank Card', minDuePct: 0.05, logoColor: '#ed1c24' },
  { id: 'RBL', name: 'RBL Bank Credit Card', minDuePct: 0.05, logoColor: '#1a3c75' },
  { id: 'INDUSIND', name: 'IndusInd Bank Credit Card', minDuePct: 0.05, logoColor: '#8a1538' },
  { id: 'AMEX', name: 'American Express India', minDuePct: 0.05, logoColor: '#006fcf' },
];

export const MOBILE_OPERATORS = [
  { id: 'JIO', name: 'Jio Prepaid', code: 'JIO', logo: 'Jio' },
  { id: 'AIRTEL', name: 'Airtel Prepaid', code: 'AIRTEL', logo: 'Airtel' },
  { id: 'VI', name: 'Vi (Vodafone Idea)', code: 'VI', logo: 'Vi' },
  { id: 'BSNL', name: 'BSNL Prepaid GSM', code: 'BSNL', logo: 'BSNL' },
];

export const MOBILE_CIRCLES = [
  'Gujarat',
  'Mumbai',
  'Maharashtra & Goa',
  'Delhi NCR',
  'Rajasthan',
  'Madhya Pradesh & CG',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh (West)',
  'Uttar Pradesh (East)',
  'Punjab',
];

export const RECHARGE_PLANS: Record<string, Array<{ id: string; amount: number; validity: string; data: string; description: string; tag?: string }>> = {
  Popular: [
    { id: 'p1', amount: 239, validity: '24 Days', data: '1.5 GB/Day', description: 'Truly Unlimited Voice + 100 SMS/day + High Speed 4G/5G', tag: 'BESTSELLER' },
    { id: 'p2', amount: 299, validity: '28 Days', data: '1.5 GB/Day', description: 'Unlimited Calling + 100 SMS/day + Free National Roaming', tag: 'POPULAR' },
    { id: 'p3', amount: 349, validity: '28 Days', data: '2.0 GB/Day', description: 'Hero Unlimited + 100 SMS/Day + Weekend Data Rollover', tag: 'HIGH SPEED' },
    { id: 'p4', amount: 666, validity: '70 Days', data: '1.5 GB/Day', description: 'Value Pack: Unlimited Voice Calls + 100 SMS/Day', tag: 'VALUE PACK' },
  ],
  Unlimited: [
    { id: 'u1', amount: 749, validity: '72 Days', data: '2.0 GB/Day', description: 'Unlimited 5G Data eligible + Free National Roaming + Binge All Night' },
    { id: 'u2', amount: 839, validity: '84 Days', data: '2.0 GB/Day', description: 'Unlimited Local, STD & Roaming calls + 100 SMS/day + OTT bundle' },
    { id: 'u3', amount: 999, validity: '84 Days', data: '3.0 GB/Day', description: 'Power User Unlimited + 100 SMS/day + Free Hotstar Mobile access' },
    { id: 'u4', amount: 2999, validity: '365 Days', data: '2.5 GB/Day', description: 'Annual 1 Year Plan: Unlimited Voice + 2.5GB/Day + 100 SMS/Day' },
  ],
  Data: [
    { id: 'd1', amount: 19, validity: '1 Day', data: '1 GB', description: 'Data Booster top-up on active existing base plan' },
    { id: 'd2', amount: 29, validity: '1 Day', data: '2 GB', description: 'High speed data voucher with instant activation' },
    { id: 'd3', amount: 65, validity: 'Existing Base Plan', data: '4 GB', description: 'Add-on data balance pack' },
    { id: 'd4', amount: 181, validity: '30 Days', data: '30 GB Work From Home', description: 'Bulk 30 GB high speed data pack without daily limits' },
  ],
  Validity: [
    { id: 'v1', amount: 99, validity: '28 Days', data: '200 MB', description: 'Limited Talktime Rs 99 + 200 MB Data for secondary SIM validity' },
    { id: 'v2', amount: 155, validity: '24 Days', data: '1 GB Total', description: 'Validity extension + Unlimited Calling + 300 SMS total' },
    { id: 'v3', amount: 179, validity: '28 Days', data: '2 GB Total', description: 'Basic voice calling package with 28 days full validity' },
  ],
};

export const DTH_OPERATORS = [
  { id: 'TATAPLAY', name: 'Tata Play (Tata Sky)', paramName: 'Subscriber ID / RMN', placeholder: '10-digit Subscriber ID' },
  { id: 'AIRTEL_DTH', name: 'Airtel Digital TV', paramName: 'Customer ID', placeholder: '10-digit Customer ID' },
  { id: 'DISHTV', name: 'Dish TV India', paramName: 'Viewing Card No (VC)', placeholder: '11-digit VC Number' },
  { id: 'SUNDIRECT', name: 'Sun Direct DTH', paramName: 'Smart Card No', placeholder: '11-digit Smart Card' },
  { id: 'D2H', name: 'D2H (Videocon)', paramName: 'Customer ID / VC No', placeholder: 'Customer ID or VC' },
];

// Helper to simulate realistic delay
export const simulateDelay = (ms: number = 700) => new Promise(resolve => setTimeout(resolve, ms));

// Mock bill generator
export function generateMockBill(category: string, billerId: string, consumerNo: string) {
  const hash = Math.abs(consumerNo.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const baseAmount = 450 + (hash % 2850);
  const lateFee = (hash % 5 === 0) ? 50 : 0;
  
  const names = [
    'Rameshchandra K. Patel',
    'Hareshbhai D. Shah',
    'Chandresh B. Prajapati',
    'Kirtikumar V. Dave',
    'Meenaben S. Trivedi',
    'Alpesh M. Barot',
    'Sureshbhai G. Vaghela',
    'Dineshbhai P. Joshi',
  ];
  const customerName = names[hash % names.length];

  return {
    customerName,
    consumerNo,
    billNumber: `BILL-${new Date().getFullYear()}-${100000 + (hash * 13) % 899999}`,
    billDate: '15 Sept 2026',
    dueDate: '05 Oct 2026',
    billAmount: baseAmount,
    lateFee,
    totalPayable: baseAmount + lateFee,
    billerStatus: 'ACTIVE',
  };
}

// Mock Credit Card bill generator
export function generateMockCardBill(issuerName: string, cardLast4: string) {
  const hash = parseInt(cardLast4, 10) || 4892;
  const totalDue = 12500 + ((hash * 17) % 78500);
  const minDue = Math.round(totalDue * 0.05);

  const cardHolders = [
    'Ketan R. Shah',
    'Shaileshkumar G. Patel',
    'Nirmalkumar J. Patel',
    'Bhavesh M. Solanki',
    'Pooja R. Mehta',
    'Devendra S. Rajput',
  ];
  const cardHolder = cardHolders[hash % cardHolders.length];

  return {
    cardHolder,
    issuerName,
    cardEnding: cardLast4,
    totalDue,
    minDue,
    dueDate: '08 Oct 2026',
    creditLimit: 150000,
    availableLimit: 150000 - totalDue,
  };
}

// Mock DMT Sender & Beneficiary
export function getMockSender(mobile: string) {
  return {
    mobile,
    name: 'Shaileshkumar G. Patel',
    status: 'ACTIVE_KYC',
    monthlyLimit: 500000,
    availableLimit: 425000,
    consumedLimit: 75000,
  };
}

export function verifyMockBeneficiary(accountNumber: string, ifsc: string) {
  const last4 = accountNumber.slice(-4) || '1234';
  const names = [
    'Bharat S. Vaghela',
    'Mukeshbhai D. Panchal',
    'Kiranben H. Rawal',
    'Pravinbhai K. Solanki',
    'Jayesh R. Patel',
  ];
  const name = names[parseInt(last4, 10) % names.length || 0];

  let bankName = 'State Bank of India';
  if (ifsc.startsWith('HDFC')) bankName = 'HDFC Bank Ltd';
  else if (ifsc.startsWith('ICIC')) bankName = 'ICICI Bank Ltd';
  else if (ifsc.startsWith('UTIB')) bankName = 'Axis Bank Ltd';
  else if (ifsc.startsWith('KKBK')) bankName = 'Kotak Mahindra Bank';
  else if (ifsc.startsWith('BARB')) bankName = 'Bank of Baroda';

  return {
    verified: true,
    accountHolder: name,
    bankName,
    accountNumber,
    ifsc: ifsc.toUpperCase(),
    accountType: 'Savings Account',
  };
}
