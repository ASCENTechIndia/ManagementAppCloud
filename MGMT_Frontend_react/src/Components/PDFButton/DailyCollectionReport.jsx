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

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "NotoSansDevanagari",
    borderWidth: 2,
    borderColor: "#000",
    borderStyle: "solid",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 0,
    height: 80,
  },
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
    textAlign: "center",
    marginBottom: 10,
  },
  companyName: {
    fontSize: 10,
    textAlign: "center",
  },
  box: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    marginTop: 5,
  },
  table: {
    display: "table",
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableHeaderCell: {
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
    fontSize: 9,
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCell: {
    // flex: 1,
    fontSize: 8,
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 2,
  },
});

// Page Component
const PDFPage = ({ companyName, logo, data, rows }) => {
  const rowsPerPage = 25;
  const chunks = [];
  const rowChunk = rows;
  for (let i = 0; i < data.rows.length; i += rowsPerPage) {
    chunks.push(data.rows.slice(i, i + rowsPerPage));
  }
if (!data?.rows || data.rows.length === 0) {
  return (
    <Page style={styles.page}>
      <Text>No data available.</Text>
    </Page>
  );
}
      console.log("rows:", rows);
console.log("Is Array:", Array.isArray(rows));

const columnWidths = [
  "8%",  // 1: पावती दिनांक
  "12%", // 2: पावती क्रमांक
  "10%", // 3: पेमेंट देणारचे नाव
  "10%", // 4: कोणत्या कामासाठी
  "10%", // 5: मुदतीसाठी

  // Revenue Columns (6–15)
  "7%", "7%", "7%", "7%", "7%", "7%", "7%", "7%", "7%", "7%",

  "7%", // 16: एकूण
  "7%", // 17: शेरा
];
const totals = {
  SECDEPOSITE: 0,
  RENT: 0,
  SERV: 0,
  EDU: 0,
  SPLEDU: 0,
  CGST: 0,
  SGST: 0,
  NOTFEE: 0,
  ADVANCEAMT: 0,
  FINE: 0,
  TOTAL: 0,
};
const allRows = rows || data?.rows || [];
allRows.forEach((row) => {
  totals.SECDEPOSITE += Number(row.SECDEPOSITE) || 0;
  totals.RENT += Number(row.RENT) || 0;
  totals.SERV += Number(row.SERV) || 0;
  totals.EDU += Number(row.EDU) || 0;
  totals.SPLEDU += Number(row.SPLEDU) || 0;
  totals.CGST += Number(row.CGST) || 0;
  totals.SGST += Number(row.SGST) || 0;
  totals.NOTFEE += Number(row.NOTFEE) || 0;
  totals.ADVANCEAMT += Number(row.ADVANCEAMT) || 0;
  totals.FINE += Number(row.FINE) || 0;

  totals.TOTAL +=
    (Number(row.SECDEPOSITE) || 0) +
    (Number(row.RENT) || 0) +
    (Number(row.SERV) || 0) +
    (Number(row.EDU) || 0) +
    (Number(row.SPLEDU) || 0) +
    (Number(row.CGST) || 0) +
    (Number(row.SGST) || 0) +
    (Number(row.NOTFEE) || 0) +
    (Number(row.ADVANCEAMT) || 0) +
    (Number(row.FINE) || 0);
});
  return (
    <>
      {chunks.map((rowChunk, pageIndex) => (
        <Page key={pageIndex} size={{ width: 1000, height: 912 }} style={styles.page}>
          <View style={styles.box}>
            {/* Header */}
            <View style={styles.headerContainer}>
              {logo && <Image src={logo} style={styles.logo} />}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{companyName}</Text>
                <Text style={{ textAlign: "center", fontSize: 12 }}>
                  नमुना ७८ नियम १०३(२),११०(२),११६(२) पहा
                </Text>
                <Text style={{ textAlign: "center", fontSize: 12 }}>
                  {data.financialYear} या वर्षांसाठी संकिर्ण जमा रकमाची वसुली नोंदवही
                </Text>
              </View>
            </View>
            <Text style={{ textAlign: "left", fontSize: 12, marginBottom: 10, marginRight: 5, paddingLeft: 3 }}>{data.date}</Text>

            {/* Table */}
        <View style={styles.table}>
  {/* Header Row */}
  <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#000" }}>
    {/* First 5 Columns */}
    {[ "पावती दिनांक\n१", "पावती क्रमांक व पुस्तक क्रमांक\n२", "पेमेंट देणारचे नाव\n३", "कोणत्या कामासाठी\n४", "ज्या मुदतीसाठी देय असेल त्या बद्दल\n५" ].map((label, idx) => (
      <View
        key={idx}
        style={{
          width: columnWidths[idx],
          borderRightWidth: 1,
          borderColor: "#000",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Text style={{ fontSize: 9, fontWeight: "bold", textAlign: "center" }}>{label}</Text>
      </View>
    ))}

    {/* Revenue Columns Header */}
    <View style={{ width: "70%", borderRightWidth: 1, borderColor: "#000" }}>
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: "#000",
          justifyContent: "center",
          alignItems: "center",
          height: 20,
        }}
      >
        <Text style={{ fontSize: 9, fontWeight: "bold", textAlign: "center" }}>
          वसुल केलेल्या महसुलाचे नाव व त्यांची रक्कम
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        {[
          "सुरक्षा ठेव\n६", "गाळा भाडे\n७", "सेवा कर\n८", "शिक्षण कर\n९",
          "उच्च शिक्षण कर\n१०", "सी.जी.एस.टी\n११", "एस.जी.एस.टी\n१२",
          "नोटीस फी\n१३", "समायोजित रक्कम\n१४", "व्याज\n१५"
        ].map((label, idx) => (
          <View
            key={idx}
            style={{
              width: "10%",
              borderRightWidth: idx !== 9 ? 1 : 0,
              borderColor: "#000",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 8, textAlign: "center" }}>{label}</Text>
          </View>
        ))}
      </View>
    </View>

    {/* Total & Remark */}
    {[ "एकूण\n१६", "शेरा\n१७" ].map((label, idx) => (
      <View
        key={idx}
        style={{
          width: columnWidths[15 + idx],
          borderRightWidth: idx === 0 ? 1 : 0,
          borderColor: "#000",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Text style={{ fontSize: 9, fontWeight: "bold", textAlign: "center" }}>{label}</Text>
      </View>
    ))}
  </View>

  {/* Data Rows */}
  {rowChunk.map((row, idx) => (
    <View key={idx} style={styles.tableRow}>
      <Text style={{ ...styles.tableCell, width: columnWidths[0] }}>{new Date(row.LEASTRANS_DATE).toLocaleDateString("en-GB")}</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[1] }}>{row.RECNO}</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[2] }}>{row.PARTYNAME}</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[3] }}>{row.PROPERTYNAME}</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[4] }}>{row.F_YEAR}</Text>

      {/* Revenue 6–15 */}
      <Text style={{ ...styles.tableCell, width: columnWidths[5] }}>{row.SECDEPOSITE}.00</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[6] }}>{row.RENT}.00</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[7] }}>{row.SERV}.00</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[8] }}>{row.EDU}.00</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[9] }}>{row.SPLEDU}.00</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[10] }}>{row.CGST}.00</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[11] }}>{row.SGST}.00</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[12] }}>{row.NOTFEE}.00</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[13] }}>{row.ADVANCEAMT}.00</Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[14] }}>{row.FINE}.00</Text>

      {/* Total & Remark */}
      <Text style={{ ...styles.tableCell, width: columnWidths[15] }}>
        {(row.ARREARAMT || 0) + (row.SECDEPOSITE || 0) + (row.CURRAMT || 0) +
         (row.CGST || 0) + (row.SGST || 0) + (row.RENT || 0) + (row.SERV || 0) +
         (row.EDU || 0) + (row.SPLEDU || 0) + (row.NOTFEE || 0) + (row.FINE || 0) +
         (row.ADVANCEAMT || 0)}
      </Text>
      <Text style={{ ...styles.tableCell, width: columnWidths[16] }}>{row.REMARK}</Text>
    </View>
  ))}

  {/* ✅ Total Row only for last page */}
 {pageIndex === chunks.length - 1 && (
  <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "#000" }}>
    {/* Merge first 5 columns with "एकूण" */}
    <View
      style={{
        width: columnWidths.slice(0, 5).reduce((sum, width) => {
          // Convert % string to number and get total %
          return sum + parseFloat(width);
        }, 0) + "%",
        borderRightWidth: 1,
        borderColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}
    >
      <Text style={{ fontSize: 9, fontWeight: "bold", textAlign: "center" }}>
        एकूण
      </Text>
    </View>

    {/* Revenue Columns Total (6 to 15) */}
    {[
      totals.SECDEPOSITE,
      totals.RENT,
      totals.SERV,
      totals.EDU,
      totals.SPLEDU,
      totals.CGST,
      totals.SGST,
      totals.NOTFEE,
      totals.ADVANCEAMT,
      totals.FINE,
    ].map((val, idx) => (
      <View
        key={idx}
        style={{
          width: columnWidths[5 + idx],
          borderRightWidth: 1,
          borderColor: "#000",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Text style={{ fontSize: 7, fontWeight: "bold", textAlign: "center" }}>
          {val.toFixed(2)}
        </Text>
      </View>
    ))}

    {/* Column 16: Total of all */}
    <View
      style={{
        width: columnWidths[15],
        borderRightWidth: 1,
        borderColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}
    >
      <Text style={{ fontSize: 7, fontWeight: "bold", textAlign: "center" }}>
        {totals.TOTAL.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Text>
    </View>

    {/* Column 17: Remark (empty) */}
    <View
      style={{
        width: columnWidths[16],
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}
    >
      <Text style={{ fontSize: 7 }}></Text>
    </View>
  </View>
)}

</View>

          </View>
        </Page>
      ))}
    </>
  );
};

// Main Component
const DailyCollectionReport = ({ pageData = [] }) => (
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

export default DailyCollectionReport;
