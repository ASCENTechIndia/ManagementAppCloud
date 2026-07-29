
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

Font.register({
  family: "NotoMarathi",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoMarathi",
    fontSize: 8,
    padding: 8,
    margin: 10,  
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  logo: { width: 60, height: 60, margin: 10 },
  centerText: {
    textAlign: "center",
    marginBottom: 4,
  },
  bold:{fontSize: 14, fontWeight: "bold"},
    boldd:{fontSize: 16, fontWeight: "bold"},

  row: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
  borderColor: "#000",
  borderStyle: "solid",
    padding: 3,
    fontSize: 8,
    textAlign: "center",
  },
  headerCell: {
    backgroundColor: "#e0e0e0",
    fontWeight: "bold",
  },
  colSmall: { width: 30 },
  colMedium: { width: 60 },
  colLarge: { width: 120 },
  colGroup: { width: 90 }, // Each group (thakbaki/chalu)
  colTotal: { width: 45 },
});

const TableHeader = () => (
  <>
    <View style={styles.row}>
      <Text style={[styles.cell, styles.colSmall, styles.headerCell]}></Text>
      <Text style={[styles.cell, styles.colMedium, styles.headerCell]}></Text>
      <Text style={[styles.cell, styles.colMedium, styles.headerCell]}></Text>
      <Text style={[styles.cell, styles.colLarge, styles.headerCell]}></Text>
      {["गाळा भाडे", "सेवा कर", "शिक्षण कर", "उच्च शिक्षण कर", "CGST", "SGST","नोटीस फी","व्याज", "एकूण"].map((label, i) => (
        <View key={i} style={[styles.row, { width: 90 }]}> {/* 2 sub cols */}
          <Text style={[styles.cell, styles.colGroup, styles.headerCell]}>{label}</Text>
        </View>
      ))}
      <Text style={[styles.cell, styles.colTotal, styles.headerCell]}>एकूण</Text>
    </View>
    <View style={styles.row}>
      <Text style={[styles.cell, styles.colSmall, styles.headerCell]}>अ.क्र.</Text>
      <Text style={[styles.cell, styles.colMedium, styles.headerCell]}>संकुलाचे नाव</Text>
      <Text style={[styles.cell, styles.colMedium, styles.headerCell]}>गाळा क्र.</Text>
      <Text style={[styles.cell, styles.colLarge, styles.headerCell]}>गाळधारकाचे नाव</Text>
      {[...Array(9)].flatMap((_, i) => [
        <Text key={`t-${i}`} style={[styles.cell, { width: 45 }, styles.headerCell]}>थकबाकी</Text>,
        <Text key={`c-${i}`} style={[styles.cell, { width: 45 }, styles.headerCell]}>चालू</Text>,
      ])}
      <Text style={[styles.cell, styles.colTotal, styles.headerCell]}></Text>
    </View>
  </>
);

const OutstandingReport = ({ reportData, logo, municipalText, financialYear }) => {
  const totals = {
    ARREARENT: 0, CURRRENT: 0,
    ARREASERV: 0, CURRSERV: 0,
    ARREAEDU: 0, CURREDU: 0,
    ARREASPLEDU: 0, CURRSPLEDU: 0,
    ARREACGST: 0, CGST_AMOUNT: 0,
    ARREASGST: 0, SGST_AMOUNT: 0,
    ARREANOTFEE:0,CURRNOTFEE:0,
    ARREAFINE:0,CURRFINE:0,
    TOT_AMT:0,TOTAL: 0,
  };

  reportData.forEach(item => {
    Object.keys(totals).forEach(key => {
      totals[key] += Number(item[key] || 0);
    });
  });
const calculateRowTotal = (item) =>
  [
    "ARREARENT", "CURRRENT", "ARREASERV", "CURRSERV",
    "ARREAEDU", "CURREDU", "ARREASPLEDU", "CURRSPLEDU",
    "ARREACGST", "CGST_AMOUNT", "ARREASGST", "SGST_AMOUNT",
    "ARREANOTFEE", "CURRNOTFEE", "ARREAFINE", "CURRFINE"
  ].reduce((sum, key) => sum + (Number(item[key]) || 0), 0);

  return (
    <Document>
      <Page size="A3" orientation="landscape" style={styles.page}>
        
        <View style={styles.header}>
          {logo && <Image style={styles.logo} src={logo} />}
          <View style={{ flex: 1 }}>
            <Text style={[styles.centerText,styles.boldd]}>{municipalText}</Text>
            <Text style={[styles.centerText,styles.bold]}>Outstanding List Report</Text>
            <Text style={[styles.centerText,{fontSize:12}]}>Financial Year : {financialYear}</Text>
          </View>
        </View>

        <TableHeader />

        {reportData.map((item, i) => (
          <View style={styles.row} key={i}>
            <Text style={[styles.cell, styles.colSmall]}>{i + 1}</Text>
            <Text style={[styles.cell, styles.colMedium]}>{item.PROPNAME}</Text>
            <Text style={[styles.cell, styles.colMedium]}>{item.UNITNO}</Text>
            <Text style={[styles.cell, styles.colLarge]}>{item.PARTY_NAME}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.ARREARENT?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.CURRRENT?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.ARREASERV?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.CURRSERV?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.ARREAEDU?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.CURREDU?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.ARREASPLEDU?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.CURRSPLEDU?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.ARREACGST?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.CGST_AMOUNT?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.ARREASGST?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.SGST_AMOUNT?.toFixed(2) || "0.00"}</Text>
               <Text style={[styles.cell, { width: 45 }]}>{item.ARREANOTFEE?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.CURRNOTFEE?.toFixed(2) || "0.00"}</Text>
               <Text style={[styles.cell, { width: 45 }]}>{item.ARREAFINE?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{item.CURRFINE?.toFixed(2) || "0.00"}</Text>
             <Text style={[styles.cell, { width: 45 }]}>{item.TOT_AMT?.toFixed(2) || "0.00"}</Text>
            <Text style={[styles.cell, { width: 45 }]}>{calculateRowTotal(item).toFixed(2)}</Text>
            {/* <Text style={[styles.cell, styles.colTotal]}>{(item.TOTAL ?? 0).toFixed(2)}</Text> */}
            <Text style={[styles.cell, styles.colTotal]}>
  {calculateRowTotal(item).toFixed(2)}
</Text>
          </View>
        ))}

        <View style={[styles.row]}>
          <Text style={[styles.cell, styles.colSmall]}></Text>
          <Text style={[styles.cell, styles.colMedium]}></Text>
          <Text style={[styles.cell, styles.colMedium]}></Text>
          <Text style={[styles.cell, styles.colLarge]}>एकूण योग</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.ARREARENT.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.CURRRENT.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.ARREASERV.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.CURRSERV.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.ARREAEDU.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.CURREDU.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.ARREASPLEDU.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.CURRSPLEDU.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.ARREACGST.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.CGST_AMOUNT.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.ARREASGST.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.SGST_AMOUNT.toFixed(2)}</Text>
           <Text style={[styles.cell, { width: 45 }]}>{totals.ARREANOTFEE.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.CURRNOTFEE.toFixed(2)}</Text>
           <Text style={[styles.cell, { width: 45 }]}>{totals.ARREAFINE.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.CURRFINE.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{totals.TOT_AMT.toFixed(2)}</Text>
          <Text style={[styles.cell, { width: 45 }]}>{calculateRowTotal(totals).toFixed(2)}</Text>
          {/* <Text style={[styles.cell, styles.colTotal]}>{totals.TOTAL.toFixed(2)}</Text> */}
          <Text style={[styles.cell, styles.colTotal]}>
  {calculateRowTotal(totals).toFixed(2)}
</Text>

        </View>
      </Page>
    </Document>
  );
};

export default OutstandingReport;
