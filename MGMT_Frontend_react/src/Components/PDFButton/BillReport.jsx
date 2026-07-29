// BillPrintPDF.jsx
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// ✅ Register Marathi font
Font.register({
  family: "NotoMarathi",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});



const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoMarathi",
    fontSize: 10,
    padding: 10,
    border: "1px solid black",
  },
  header: { textAlign: "center", marginBottom: 6 },
  logoRow: { flexDirection: "row", justifyContent: "space-between" },
  table: {
    border: "1px solid #000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  cell: {
    padding: 3,
    borderRight: "1px solid #000",
    textAlign: "center",
  },
  cellBold: {
    fontWeight: "bold",
  },
  footer: {
    borderTop: "1px solid #000",
    paddingHorizontal: 10,
    fontSize: 10,
  },
});

const BillPrintPDF = ({ billData, logo, municipalText, userName, ulbId }) => {
  const getMappingAndDescriptions = (ulbId) => {
  const baseMap = {
    "गाळा भाडे": "RENT",
    "सी.जी.एस.टी.": "CGST",
    "एस.जी.एस.टी.": "SGST",
  };

  const ulbMap = {
     "4": {
      visible: {
        edu: false,
        spledu: false,
        notfee: true,
        interest: true,
        other: true,
      },
      map: {
        "सेवा कर": "txtArrSeva1",
         "विशेष स्वच्छता कर": "txtArrSplClean1",
        "पाणीपट्टी": "txtArrWater1",
      },
    },
    "5": {
      labels: {
        serkar: "रोजगार हमी कर",
        edu: "म. शा. शिक्षण कर",
      },
      visible: {
        edu: true,
        spledu: true,
        notfee: true,
        fine: true,
        interest: true,
        other: true,
        akushak: false,
        penalty: false,
      },
      map: {
        "ठेव": "SECDEPOSITE",
        "रोजगार हमी कर": "SERV",
        "म. शा. शिक्षण कर": "EDU",
        "उच्च शिक्षण कर": "SPLEDU",
        "नोटीस फी": "NOTFEE",
        "व्याज": "FINE",
        "इतर": "OTHER",
        // "दंड": "PENALTY",
      },
    },
     "50": {
      visible: {
        edu: false,
        spledu: false,
        notfee: true,
        fine: true,
        interest: true,
        other: true,
        akushak: false,
        penalty: false,
      },
      map: {
        "ठेव": "SECDEPOSITE",
        "सेवा कर": "SERV",
        "म. शा. शिक्षण कर": "EDU",
        "उच्च शिक्षण कर": "SPLEDU",
        "नोटीस फी": "NOTFEE",
        "व्याज": "FINE",
        "इतर": "OTHER",
        // "दंड": "PENALTY",
      },
    },
    "930": {
      visible: {
        edu: false,
        spledu: false,
        notfee: true,
        akushak: true,
        penalty: true,
      },
      map: {
        "सेवा कर": "SERV",
        "परवाना": "SERV",
        "सेवा शुल्क": "FINE",
        "अकृषक कर": "AKRUSHAK",
        "जाहिरात व इतर खर्च": "NOTFEE",
      },
    },
    "990": {
      visible: {
        edu: false,
        spledu: false,
        notfee: false,
        akushak: false,
        penalty: true,
      },
      labels: {
        penalty: "विलंब शुल्क",
      },
      map: {
        "विलंब शुल्क": "PENALTY",
        "ठेव": "SECDEPOSITE",
         "इतर": "OTHER",
      },
    },
    "590": {
      visible: {
        edu: false,
        spledu: false,
        notfee: false,
        akushak: false,
        penalty: false,
      },
    },
    "670": {
      visible: {
        edu: true,
        spledu: true,
        notfee: false,
        akushak: false,
        penalty: false,
      },
      map: {
         "ठेव": "SECDEPOSITE",
        "सेवा कर": "SERV",
        "शिक्षण कर": "EDU",
        "उच्च शिक्षण कर" : "SPLEDU",
            "व्याज": "FINE",
        "इतर": "OTHER",
      },
    },
  };

  const ulbSpecific = ulbMap[ulbId] || {};
  const mapping = { ...baseMap, ...(ulbSpecific.map || {}) };

  const descriptions = [
    ...(ulbId === "5" || ulbId === "670" || ulbId === "990"? ["ठेव"] : []),
    "गाळा भाडे",
    ...(ulbId === "5" ? [ulbSpecific?.labels?.serkar || "रोजगार हमी कर"] : []),
    ...(ulbId === "5" ? [ulbSpecific?.labels?.edu || "म. शा. शिक्षण कर"] : []),
    ...(ulbId === "5" ? ["उच्च शिक्षण कर"] : []),
     ...(ulbId === "670" ? ["शिक्षण कर", "उच्च शिक्षण कर"] : []),
    ...(ulbId === "670" || ulbId === "930" ||ulbId==="4" ? ["सेवा कर"] : []),
    ...(ulbId === "4" ? ["विशेष स्वच्छता कर", "पाणीपट्टी" ] : []),
    "सी.जी.एस.टी.",
    "एस.जी.एस.टी.",
    ...(ulbId === "930" ? ["परवाना", "सेवा शुल्क", "अकृषक कर", "जाहिरात व इतर खर्च"] : []),
    ...(ulbId === "5"|| ulbId==="4"  ? ["नोटीस फी", "व्याज", "इतर"] : []),
    ...(ulbId === "670"? ["नोटीस फी", "व्याज", "इतर"] : []),
    ...(ulbId === "990" ? ["विलंब शुल्क", "इतर"] : []),
  ];

  return { mapping, descriptions, visible: ulbSpecific.visible || {}, labels: ulbSpecific.labels || {} };
};
const { mapping, descriptions } = getMappingAndDescriptions(ulbId);
const samayojanUlbs = [670, 990];
const nototalulbs = [990];
const donotshowtotal = nototalulbs.includes(Number(ulbId));
const showSamayojanRow = samayojanUlbs.includes(Number(ulbId));
const billRows = descriptions.map((label) => {
  if (label === "अकृषक कर") {
    return {
      label,
      arrear: billData["ARRAKRUSHAK"] ?? 0,
      curr: billData["CURRAKRUSHAK"] ?? 0,
    };
  }

  const mapKey = mapping[label];
  if (!mapKey) {
    return { label, arrear: 0, curr: 0 };
  }

  const core = mapKey.replace("txtArr", "").replace("1", "");
  const upperCode = core.toUpperCase();
  const arrearKey = "ARREAR" + upperCode;
  const currKey = "CURR" + upperCode;

  return {
    label,
    arrear: billData[arrearKey] ?? 0,
    curr: billData[currKey] ?? 0,
  };
});

const totalArrear = billRows.reduce((sum, row) => sum + Number(row.arrear || 0), 0).toFixed(2);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-IN");
function numberToMarathiWords(num) {
  const words = {
    0: "शून्य",
    1: "एक", 2: "दोन", 3: "तीन", 4: "चार", 5: "पाच", 6: "सहा", 7: "सात", 8: "आठ", 9: "नऊ",
    10: "दहा", 11: "अकरा", 12: "बारा", 13: "तेरा", 14: "चौदा", 15: "पंधरा", 16: "सोळा", 17: "सतरा", 18: "अठरा", 19: "एकोणीस",
    20: "वीस", 21: "एकवीस", 22: "बावीस", 23: "तेवीस", 24: "चोवीस", 25: "पंचवीस", 26: "सव्वीस", 27: "सत्तावीस", 28: "अठ्ठावीस", 29: "एकोणतीस",
    30: "तीस", 31: "एकतीस", 32: "बत्तीस", 33: "तेहतीस", 34: "चौतीस", 35: "पस्तीस", 36: "छत्तीस", 37: "सदतीस", 38: "अडतीस", 39: "एकोणचाळीस",
    40: "चाळीस", 41: "एकचाळीस", 42: "बेचाळीस", 43: "त्रेचाळीस", 44: "चव्वेचाळीस", 45: "पंचेचाळीस", 46: "सेहेचाळीस", 47: "सत्तेचाळीस", 48: "अठ्ठेचाळीस", 49: "एकोणपन्नास",
    50: "पन्नास", 51: "एकावन्न", 52: "बावन्न", 53: "त्रेपन्न", 54: "चोपन्न", 55: "पंचावन्न", 56: "छप्पन्न", 57: "सत्तावन्न", 58: "अठ्ठावन्न", 59: "एकोणसाठ",
    60: "साठ", 61: "एकसष्ट", 62: "बासष्ट", 63: "त्रेसष्ट", 64: "चौसष्ट", 65: "पासष्ट", 66: "सहासष्ट", 67: "सदुसष्ट", 68: "अडुसष्ट", 69: "एकोणसत्तर",
    70: "सत्तर", 71: "एकाहत्तर", 72: "बहात्तर", 73: "त्र्याहत्तर", 74: "चौर्‍याहत्तर", 75: "पंच्याहत्तर", 76: "शहात्तर", 77: "सत्याहत्तर", 78: "अठ्ठ्याहत्तर", 79: "एकोणऐंशी",
    80: "ऐंशी", 81: "एक्याऐंशी", 82: "ब्याऐंशी", 83: "त्र्याऐंशी", 84: "चौऱ्याऐंशी", 85: "पंच्याऐंशी", 86: "शहाऐंशी", 87: "सत्याऐंशी", 88: "अठ्ठ्याऐंशी", 89: "एकोणनव्वद",
    90: "नव्वद", 91: "एक्याण्णव", 92: "ब्याण्णव", 93: "त्र्याण्णव", 94: "चौऱ्याण्णव", 95: "पंच्याण्णव", 96: "शहाण्णव", 97: "सत्त्याण्णव", 98: "अठ्ठ्याण्णव", 99: "नव्यान्णव",
    100: "शंभर"
  };

  if (num === 0) return words[0];

  let result = "";

  const crore = Math.floor(num / 10000000);
  if (crore) {
    result += numberToMarathiWords(crore) + " कोटी ";
    num %= 10000000;
  }

  const lakh = Math.floor(num / 100000);
  if (lakh) {
    result += numberToMarathiWords(lakh) + " लाख ";
    num %= 100000;
  }

  const thousand = Math.floor(num / 1000);
  if (thousand) {
    result += numberToMarathiWords(thousand) + " हजार ";
    num %= 1000;
  }

  const hundred = Math.floor(num / 100);
  if (hundred) {
    if (hundred === 1) result += "एकशे ";
    else result += words[hundred] + "शे ";
    num %= 100;
  }

  if (num > 0) {
    result += words[num] + " ";
  }

  return result.trim();
}
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.table}>
          {/* 🏛️ Header */}
          <View style={[styles.logoRow, { margin: 10 }]}>
            {logo && <Image src={logo} style={{ width: 60, height: 60 }} />}
            <View style={{ flex: 1, textAlign: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                {municipalText}
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                भाडे देयक F.Y. / वर्ष: {billData.FYEAR}
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                महाराष्ट्र नगरपरिषद, नगरपंचायत व औद्योगिक नगर प्रशासन अधिनियम,
                १९६५ चे कलम १५० अन्वये.
              </Text>
            </View>
          </View>

          {/* 📄 Bill Details */}
          <View style={styles.table}>
            {" "}
            <View style={styles.tableRow}>
              <View
                style={{ marginTop: 0, flexDirection: "row", flexWrap: "wrap" }}
              >
                <Text style={[styles.cell, { width: "33%" }]}>
                  Bill No./ बिल नंबर{" "}
                </Text>
                <Text style={[styles.cell, { width: "33%" }]}>
                  Date / दिनांक
                </Text>
                <Text style={[styles.cell, { width: "34%" }]}>
                  Allotment No. / ऑलाटमेंट क्र.
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View
                style={{ marginTop: 0, flexDirection: "row", flexWrap: "wrap" }}
              >
                <Text style={[styles.cell, { width: "33%" }]}>
                  {billData.BILLNO}
                </Text>
                <Text style={[styles.cell, { width: "33%" }]}>
                  {formatDate(billData.INSDT)}
                </Text>
                <Text style={[styles.cell, { width: "34%" }]}>
                  {billData.ALLOTMENTNO}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, { width: "30%" }]}>
                Property / प्रौपर्टी / संकुल :
              </Text>
              <Text style={[styles.cell, { width: "70%" }]}>
                {billData.PROPNO} / {billData.PROPNAME}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, { width: "30%" }]}>
                Unit No. / युनिट क्र. /दुकान क्र. :
              </Text>
              <Text style={[styles.cell, { width: "70%" }]}>
                {billData.UNITNO}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.cell, { width: "30%" }]}>
                मालमत्ता धारकाचे नाव :
              </Text>
              <Text style={[styles.cell, { width: "70%" }]}>
                {billData.PARTYNAME}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, { width: "30%" }]}>
                Narration / विवरण :
              </Text>
              <Text style={[styles.cell, { width: "70%" }]}>
                {billData.NARRATION}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, { width: "30%" }]}>
                Address / पत्ता :
              </Text>
              <Text style={[styles.cell, { width: "70%" }]}>
                {billData.ADDRESS}
              </Text>
            </View>
          </View>

          {/* 💳 Charges Table */}
          <View style={styles.table}>
            <View style={[styles.table, { margin: 10 }]}>
              <View
                style={[styles.tableRow, {  fontSize: 12 }]}
              >
                <Text style={[styles.cell, { width: "5%" , fontWeight: "bold",}]}>क्र</Text>
                <Text style={[styles.cell, { width: "35%", fontWeight: "bold", }]}>मागणी</Text>
                <Text style={[styles.cell, { width: "20%", fontWeight: "bold", }]}>थकबाकी</Text>
                <Text style={[styles.cell, { width: "20%", fontWeight: "bold",}]}>चालू</Text>
                <Text style={[styles.cell, { width: "20%", fontWeight: "bold", }]}>रक्कम</Text>
              </View>

              {billRows.map((item, i) => (
  <View key={i} style={styles.tableRow}>
    <Text style={[styles.cell, { width: "5%" }]}>{i + 1}</Text>
    <Text style={[styles.cell, { width: "35%" }]}>{item.label}</Text>
    <Text style={[styles.cell, { width: "20%" }]}>{item.arrear.toFixed(2)}</Text>
    <Text style={[styles.cell, { width: "20%" }]}>{item.curr.toFixed(2)}</Text>
    <Text style={[styles.cell, { width: "20%" }]}> {(item.arrear + item.curr).toFixed(2)}</Text>
  </View>
))}


           {!donotshowtotal && (
              <View style={[styles.tableRow]}>
                <Text style={[styles.cell, { width: "40%" }]}>एकूण</Text>
                <Text style={[styles.cell, { width: "20%" }]}>{totalArrear}</Text>
                <Text style={[styles.cell, { width: "20%" }]}>
                  {billData.TOTAL_AMT.toFixed(2)}
                </Text>
                <Text style={[styles.cell, { width: "20%" }]}>
                    {(Number(totalArrear) + Number(billData.TOTAL_AMT)).toFixed(2)}
                </Text>
              </View>
           )}
      
{showSamayojanRow && (
  <>
    <View style={[styles.tableRow]}>
      <Text style={[styles.cell, { width: "40%" }]}>समायोजन रक्कम</Text>
      <Text style={[styles.cell, { width: "20%" }]}>
        {Number(billData.ARRSAMYOJAN || 0).toFixed(2)}
      </Text>
      <Text style={[styles.cell, { width: "20%" }]}>
        {Number(billData.CURRSAMYOJAN || 0).toFixed(2)}
      </Text>
      <Text style={[styles.cell, { width: "20%" }]}>
        {(Number(billData.ARRSAMYOJAN || 0) + Number(billData.CURRSAMYOJAN || 0)).toFixed(2)}
      </Text>
    </View>

    <View style={[styles.tableRow]}>
      <Text style={[styles.cell, { width: "40%" }]}>एकूण</Text>
      <Text style={[styles.cell, { width: "20%" }]}>
        {(Number(totalArrear) + Number(billData.ARRSAMYOJAN || 0)).toFixed(2)}
      </Text>
      <Text style={[styles.cell, { width: "20%" }]}>
        {(Number(billData.TOTAL_AMT) + Number(billData.CURRSAMYOJAN || 0)).toFixed(2)}
      </Text>
      <Text style={[styles.cell, { width: "20%" }]}>
        {(
          Number(totalArrear) +
          Number(billData.TOTAL_AMT) +
          Number(billData.ARRSAMYOJAN || 0) +
          Number(billData.CURRSAMYOJAN || 0)
        ).toFixed(2)}
      </Text>
    </View>
  </>
)}
            </View>
          </View>
          <View style={styles.table}>
            <Text style={{ margin: 10 }}>
              सन {billData.FYEAR} वर्षांबाबत तुमच्याकडून नगरपालिकेकडे येणे आहे.
              हे मागणी बिल आपणास मिळाले पासून पंचधरा दिवसाचे आत येणे असलेली
              मागणी केलेली संपूर्ण रक्कम १५ दिवसाचे आत भरली नाही किंवा ती रक्कम
              देण्यास आपण का जबाबदार नाही याबाबत आयुक्त यांची खात्री होईल अशा
              रीतीने कारण दाखविले नाही अगर कलम १५२ च्या उपबंधानुसार अशा मागणी
              विरुद्ध अपील केले नाही तर कायद्यातील कलम १५२ अन्वये जमीन व जमिनीचे
              अधिपत्य पत्र काढून घेणे असल्याने सर्व रक्कम खर्चासहित वसूल करण्यात
              येईल. सदरची रक्कम भरली नाही तर उपरोक्त बिल मिळालेल्या तारखेपासून
              १५ दिवसाची मुदत संपल्यानंतर सदरचे रकमेवर २% या दराने व्याजाची
              आकारणी केली जाईल व कलम १५२ अन्वये आयुक्त यांच्या सहीने वॉरंट
              (अधिपत्र) काढून घेणे असल्याने सर्व रक्कम वसूल करण्यात येईल.
            </Text>
            <Text style={{ margin: 10 }}>
              टीप : सदर देयकात कोणतीही त्रुटी / चूक असल्यास दुसऱ्याच्या अधिन
              राहून देयक देण्यात येत आहे. संपूर्ण भाड्याची रक्कम मुदतीत भरून दंड
              टाळावा.
            </Text>
          </View>
          {/* 📝 Footer */}
          <View style={[styles.table]}>
            {/* Amount in Words Row */}
            <View
              style={{
                flexDirection: "row",
                borderBottom: 1,
                padding: 4,
                alignItems: "center",
              }}
            >
              <Text style={{ width: "50%", fontWeight: "bold" }}>
                Amount In Words / अक्षरी रक्कम : {numberToMarathiWords(billData.TOTAL_AMT)} रूपये
              </Text>
            </View>

            {/* Signature Area */}
            <View
              style={{
                height: 100,
                paddingRight: 10,
                justifyContent: "flex-end",
                textAlign: "right",
              }}
            >
              <Text style={{ textAlign: "right", fontWeight: "bold" ,paddingRight:20 }}>
                भाडे संग्राहक आयुक्त
              </Text>

              <Text style={{ textAlign: "right", fontWeight: "bold" }}>
                {municipalText}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginVertical: 10,
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ textAlign: "left" }}>Print By: {userName}</Text>
          <Text style={{ textAlign: "right" }}>
            Print Date & Time: {new Date().toLocaleString("en-IN")}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default BillPrintPDF;
