import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,Image,
} from "@react-pdf/renderer";

// Register Marathi Font
Font.register({
  family: "NotoMarathi",
  src: "/fonts/NotoSansDevanagari-Regular.ttf"
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoMarathi",
    fontSize: 10,
    padding: 10
  },
    logoRow: { flexDirection: "row", justifyContent: "space-between" },

  tableHeader: {
    flexDirection: "row",
    borderBottom: 1,
    borderTop: 1,
    borderLeft: 1,
    paddingVertical: 2,
    backgroundColor: "#e0e0e0",
    fontWeight: "bold"
  },
  row: {
    flexDirection: "row",
    borderBottom: 0.5,
    borderLeft: 0.5,
  },
  cell: {
    borderRight: 0.5,
    paddingHorizontal: 1,
    textAlign: "center",
    alignItems: "center",
  },
  colSr: { width: "5%" },
  colWard: { width: "10%" },
  colPropName: { width: "15%" },
  colUnit: { width: "5%" },
  colBillNo: { width: "15%" },
  colParty: { width: "15%" },
  colReceipt: { width: "15%" },
  colAmt: { width: "10%" },
  colRemark: { width: "10%" }
});

const CollectionReportPDF = ({ data = [], municipalText ,logo }) => (
  <Document>
    <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={[styles.logoRow, { margin: 10 }]}>
                  {logo && <Image src={logo} style={{ width: 60, height: 60 }} />}
                  <View style={{ flex: 1, textAlign: "center" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 14 ,marginTop: 5}}>
                      {municipalText}
                    </Text>
                    <Text style={{ fontWeight: "bold",marginTop: 5, fontSize: 10 }}>
                    Collection Wise Data Report
                    </Text>
                    
                  </View>
                </View>
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.colSr]}>Sr. No</Text>
        <Text style={[styles.cell, styles.colWard]}>Ward</Text>
        <Text style={[styles.cell, styles.colPropName]}>Property Name</Text>
        <Text style={[styles.cell, styles.colUnit]}>Unit No</Text>
        <Text style={[styles.cell, styles.colBillNo]}>पावती क्रमांक व पुस्तक क्रमांक</Text>
        <Text style={[styles.cell, styles.colParty]}>मालमत्ता धारकाचे नाव</Text>
        <Text style={[styles.cell, styles.colReceipt]}>Receipt No</Text>
        <Text style={[styles.cell, styles.colAmt]}>Amount</Text>
        <Text style={[styles.cell, styles.colRemark]}>Remark</Text>
      </View>

      {data.map((item, index) => (
        <View style={styles.row} key={index}>
          <Text style={[styles.cell, styles.colSr]}>{index + 1}</Text>
          <Text style={[styles.cell, styles.colWard]}>{item.ZONE_NAME || ""}</Text>
          <Text style={[styles.cell, styles.colPropName]}>{item.PROP_NAME || ""}</Text>
          <Text style={[styles.cell, styles.colUnit]}>{item.UNITNO || ""}</Text>
          <Text style={[styles.cell, styles.colBillNo]}>{item.ALLOTMENTNO || ""}</Text>
          <Text style={[styles.cell, styles.colParty]}>{item.PARTY_NAME || ""}</Text>
          <Text style={[styles.cell, styles.colReceipt]}>{item.LEASTRANS_RECNO || ""}</Text>
          <Text style={[styles.cell, styles.colAmt]}>{item.CURRAMT?.toFixed(2) || "0.00"}</Text>
          <Text style={[styles.cell, styles.colRemark]}>{item.REMARK || ""}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default CollectionReportPDF;
