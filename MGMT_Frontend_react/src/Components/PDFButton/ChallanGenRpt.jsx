import React from "react";
import { Document, Page, Text, View, Image, StyleSheet, Font } from "@react-pdf/renderer";

// Register Marathi Font
Font.register({
    family: "NotoSansDevanagari",
    fonts: [
      {
        src: "/fonts/NotoSansDevanagari-Regular.ttf",
        fontWeight: "normal",
      },
      {
        src: "/fonts/NotoSansDevanagari-Bold.ttf",
        fontWeight: "bold",
      },
    ],
  });
  
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


const styles = StyleSheet.create({
  page: {padding: 20, fontFamily: "NotoSansDevanagari", borderWidth: 2, borderColor: "#000", borderStyle: "solid",},
  headerContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 0,  height: 80,  },
  
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginLeft: 0, 
  },
  
  titleContainer: {
    flex: 1, 
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center"
  },
  
  box: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    marginTop: 5,
  },
 
companyName: {
  fontSize: 10,
  textAlign: "center",
},
subtitle: {
  fontSize: 12,
  textAlign: 'center',
  marginBottom: 4,
},
rightDetailsContainer: {
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  marginLeft: 'auto',
},
detailText: {
  fontSize: 10,
  textAlign: 'right',
},
 section: {
    borderColor: "#000",
    paddingTop: "10%",
    fontSize: 9,
      marginLeft: "7%",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  col: {
    width: "36.33%",
    flexDirection: "row",
  },
  label: {
    fontWeight: "bold",
  },
  table: {
    width : "80%",
     alignSelf: "center",
  marginTop: 6,
  borderWidth: 1,
  borderColor: "#000",
},

tableRow: {
  flexDirection: "row",
  borderBottomWidth: 1,
  borderColor: "#000",
},

dataRow: {
  // Optional: makes the last row's bottom line visible
  borderBottomWidth: 0,
},

cell: {
  flex: 1,
  padding: 4,
  borderRightWidth: 1,
  borderColor: "#000",
  textAlign: "center",
  fontSize: 9,
},

lastCell: {
  borderRightWidth: 0,
},

 footerRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: "50%",
  fontSize: 12,
  paddingHorizontal: 20, // Optional, adds spacing from edges
},

leftFooter: {
  textAlign: "left",
},

rightFooter: {
  textAlign: "right",
},

  footerCol: {
    width: "50%",
    marginBottom: 2,
  },
});

const PDFPage = ({ companyName, logo,data }) => (
  <>
  
  {/* First Page: Marriage Details, Groom, and Bride Information */}
  <Page size="A4" style={styles.page}>
    <View>
      {/* Header */}
       <View style={styles.headerContainer}>
             {logo && <Image src={logo} style={styles.logo} />}
             <View style={styles.titleContainer}>
               <Text style={styles.title}>{companyName}</Text>
               <Text style={{ textAlign: "center", fontSize: 12, marginTop: 10 }}> (नियम.(२) १५.७० (२७.११४) ७८(१७)(५) (आणि १०७ पहा)) </Text>
             </View>
           </View>
            <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
  <Text style={{ fontSize: 12 }}>पुस्तक क्र.:</Text>
  <View style={{ width: 200 }} /> 
  <Text style={{ fontSize: 12 }}>अनुक्रमांक:</Text>
</View>
                      <Text style={{ textAlign: "center", fontSize: 13, marginBottom: 10 }}> महानगरपालिका कार्यालय यामध्ये पैसे भरण्यासाठी चलान </Text>
         
   <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
                <Text style={{ fontSize: 12 }}> चलन क्र. : {data.challanNo}</Text>
                 <View style={{ width: 230 }} /> 
                <Text style={{ fontSize: 12 }}>चलन दिनांक : {data.challanDate}</Text>
                </View>

       <View style={styles.table}>
    {/* Header Row */}
    <View style={styles.tableRow}>
        <Text style={[styles.cell, { fontWeight: 'bold' }]}>कराचे नांव</Text>
        <Text style={[styles.cell, { fontWeight: 'bold' }]}>रक्कम</Text>
    </View>

    {/* Data Row from backend */}
     {data.rows?.map((row, index) => (
    <View key={index} style={styles.tableRow}>
      <Text style={styles.cell}>{row.PAYMODE}</Text>
      <Text style={styles.cell}>{Number(row.AMOUNT).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
    </View>
  ))}

    {/* Total Amount Row */}
    <View style={[styles.tableRow, { borderTopWidth: 1, borderTopColor: "#000" }]}>
        <Text style={[styles.cell, { fontWeight: 'bold' }]}>Total Amount</Text>
        <Text style={[styles.cell, { fontWeight: 'bold' }]}>
        {Number(data.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Text>
    </View>
    </View>


  <View style={styles.section}>
      <Text style={{  fontSize: 12, marginBottom: 10 }}> पडताळणी ___________________________________ ला सादर केले आणि महानगरपालिका </Text>
       <Text style={{  fontSize: 12, marginBottom: 10 }}> निधीत  <Text style={{ fontWeight: 'bold'}}>{numberToMarathiWords(Number(data.amount))} रुपये</Text> जमा केले. </Text>
         <Text style={{  marginLeft: "60%", fontSize: 12, marginBottom: 10 }}> रक्कम भरणारा लिपीक </Text>
          <Text style={{  fontSize: 12, marginBottom: 10 }}> तपासले आणि वसुली नोंदवहीतील बेरजेशी रक्कम जुळते. त्यातील रोख रक्कम निकाली. </Text>
       <Text style={{  fontSize: 12, marginBottom: 10 }}> नोंद पावत्याच्या दुसऱ्या प्रतीशी पडताळून पाहिल्या होत्या. </Text>
        <Text style={{  marginLeft: "72%", fontSize: 12, marginBottom: 10 }}> तपासले आणि नोंद घेतली </Text>
  
<View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 40, marginTop: 30 }}>
  {/* Left Side */}
  <View style={{ alignItems: "center" }}>
    <Text style={{  fontSize: 12 }}>अधिक्षक</Text>
    <View style={{ width: 100, height: 1, backgroundColor: "#000", marginBottom: 2 }} />
    <Text style={{ fontSize: 12 }}>निरीक्षक</Text>
  </View>

  {/* Right Side */}
  <View style={{ alignItems: "center" }}>
    <Text style={{  fontSize: 12 }}>रोखपाल</Text>
    <View style={{ width: 100, height: 1, backgroundColor: "#000", marginBottom: 2 }} />
    <Text style={{ fontSize: 12 }}>लेखपाल / नगर सचिव</Text>
  </View>
</View>

    {/* Footer Info */}
   <View style={styles.footerRow}>
  <Text style={styles.leftFooter}>Print By : {data.user}</Text>
  <Text style={styles.rightFooter}>Print Date : {data.printDate}</Text>
</View>

  </View>
  </View>
  </Page>
</>
);

// Main Component
const ChallanGenRpt = ({ pageData = [] }) => (
  <Document>
    {pageData.map((data, index) => (
      <PDFPage
        key={index}
        companyName={data.companyName}
        logo={data.logo}
        data={data.data}
      />
    ))}
  </Document>
);

export default ChallanGenRpt;
