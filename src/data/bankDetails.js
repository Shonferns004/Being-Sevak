export const BANK_DETAILS = {
  title: "Bank Details",
  subtitle: "You can make your donation directly to our bank accounts below.",
  qrImage: "/images/Qrcode.jpeg",
  qrCaption: "Scan to Donate via UPI",
  upiId: "beingsevak@upi",
  cards: [
    {
      id: "qr",
      title: "Donation QR Code",
      icon: "fa-qrcode",
      iconColor: "#00a3da",
      qrImage: "/images/Qrcode.jpeg",
      caption: "Scan to Donate via UPI",
    },
    {
      id: "bank1",
      title: "Bank Details 1",
      icon: "fa-university",
      iconColor: "#00a3da",
      bank: "Axis Bank, Kandivali (West), Mumbai",
      accountNo: "920010066029137",
      ifsc: "UTIB0000201",
    },
    {
      id: "bank2",
      title: "Bank Details 2",
      icon: "fa-university",
      iconColor: "#00a3da",
      bank: "Saraswat Bank, Kandivali (West), Mumbai",
      accountNo: "130200100119387",
      ifsc: "SRCB0000130",
    },
  ],
};

export default BANK_DETAILS;
