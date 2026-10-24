export const TRUST_CONFIG = {
  name: "Being Sevak Charitable Trust",
  trust80GNo: "ABCDE1234FMB01",
  validTill: "31-March-2031",
  trust12ANo: "AAATB1234F",
  upiId: "beingsevak@upi",
  upiName: "Being Sevak Charitable Trust",
  merchantName: "Being Sevak Charitable Trust",
};

export function getRazorpayKey() {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_RAZORPAY_KEY_ID) {
    return import.meta.env.VITE_RAZORPAY_KEY_ID;
  }
  return 'rzp_live_StUN8QoR2STezo';
}
