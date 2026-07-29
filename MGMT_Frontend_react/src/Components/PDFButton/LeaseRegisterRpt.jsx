
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image
} from "@react-pdf/renderer";


// Register Marathi font
Font.register({
  family: "NotoMarathi",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoMarathi",
    fontSize: 6,
    padding: 15,
  },
  logoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderRight: 1,
    borderBottom: 1,
    borderColor: "#000",
    padding: 1,
    textAlign: "center",
  },
  cell1: {
    borderRight: 1, 
    borderColor: "#000",
    padding: 1,
    textAlign: "center",
  },
   cell2: {
    borderRight: 1, 
    borderColor: "#000",
    padding: 1,
     borderBottom: 1,
     borderStyle: "dotted",
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
});

const columnWidths = {
  partyName: "10%",
  business: "10%",
  allotmentTo: "10%",
  allotmentType: "10%",
  startDate: "10%",
  endDate: "10%",
  agreementPeriod: "10%",
  rent: "10%",
  rentIncrement: "10%",
  securityDeposit: "10%",
};

const LeaseRegister = ({ Data = [], municipalText = "", logo }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.logoRow}>
          {logo && <Image src={logo} style={{ width: 60, height: 60 }} />}
          <View style={{ flex: 1, textAlign: "center" }}>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>{municipalText}</Text>
            <Text style={{  fontSize: 14  }}>Lease Register Report</Text>
          </View>
        </View>

        {/* Table */}
        {Data.map((item, idx) => (
          <View style={styles.table} key={idx}>
            {/* Row 1 */}
            <View style={styles.row}>
              <Text style={[styles.cell1, { width: columnWidths.partyName }, styles.bold]}>
                Party Name
              </Text>
              <Text style={[styles.cell1, { width: columnWidths.business,padding:2 }, styles.bold]} wrap={true}>
                Nature of Bussiness
              </Text>
              <Text style={[styles.cell1, { width: columnWidths.allotmentTo }, styles.bold]} >
                Allotment To
              </Text>
              <Text style={[styles.cell1, { width: columnWidths.allotmentType }, styles.bold]}>
                Allotment Type
              </Text>
              <Text style={[styles.cell1, { width: columnWidths.startDate }, styles.bold]}>
                Start Date
              </Text>
              <Text style={[styles.cell1, { width: columnWidths.endDate }, styles.bold]}>
                End Date
              </Text>
              <Text style={[styles.cell1, { width: columnWidths.agreementPeriod }, styles.bold]}>
                Agreement Period
              </Text>
              <Text style={[styles.cell1, { width: columnWidths.rent }, styles.bold]}>
                Rent
              </Text>
              <Text style={[styles.cell1, { width: columnWidths.rentIncrement }, styles.bold]}>
                Rent Increment
              </Text>
              <Text style={[styles.cell1, { width: columnWidths.securityDeposit }, styles.bold]}>
                Security Deposit
              </Text>
            </View>

            {/* Row 2 */}
            <View style={styles.row}>
             <Text
  style={[
    styles.cell,
    { width: columnWidths.partyName },
    { numberOfLines: 1, ellipsizeMode: "tail" }
  ]}
  numberOfLines={1}
  ellipsizeMode="tail" wrap={true}
>
                {item.PARTY_NAME || ""}
              </Text>
              <Text style={[styles.cell, { width: columnWidths.business }]}>
                {item.NATURE_OF_BUSINESS || ""}
              </Text>
              <Text style={[styles.cell, { width: columnWidths.allotmentTo }]}>
                {item.ALLOTMENT_TO || ""}
              </Text>
              <Text style={[styles.cell, { width: columnWidths.allotmentType }]}>
                {item.ALLOTMENT_TYPE || ""}
              </Text>
              <Text style={[styles.cell, { width: columnWidths.startDate }]}>
                {item.START_DT || ""}
              </Text>
              <Text style={[styles.cell, { width: columnWidths.endDate }]}>
                {item.TO_DT || ""}
              </Text>
              <Text style={[styles.cell, { width: columnWidths.agreementPeriod }]}>
                {item.AGREMENT_PERIOD || ""}
              </Text>
              <Text style={[styles.cell, { width: columnWidths.rent }]}>
                {item.RENT || ""}
              </Text>
              <Text style={[styles.cell, { width: columnWidths.rentIncrement }]}>
                {item.RENT_INCREMENT || ""}
              </Text>
              <Text style={[styles.cell, { width: columnWidths.securityDeposit }]}>
                {item.SEC_DEPOSIT || ""}
              </Text>
            </View>

            {/* Row 3 - Property / Address / Usage Row */}
            <View style={styles.row}>
              <Text style={[styles.cell2, { width: columnWidths.partyName }]}></Text>
              <Text style={[styles.cell2, { width: columnWidths.business }]}>Property</Text>
              <Text style={[styles.cell2, { width: columnWidths.allotmentTo }]}>Address</Text>
              <Text style={[styles.cell2, { width: columnWidths.allotmentType }]}>
                Usage
              </Text>
              
              {[...Array(6)].map((_, i) => (
                <Text key={i} style={[styles.cell2, { width: "10%" }]}> </Text>
              ))}
            </View>

              <View style={styles.row}>
               <Text style={[styles.cell2, { width: columnWidths.partyName }]}> </Text>

              <Text style={[styles.cell2, { width: columnWidths.business }, {numberOfLines: 1, ellipsizeMode: "tail" }]} numberOfLines={1}
  ellipsizeMode="tail" wrap={true}> {item.PROP_NAME || ""}</Text>
              <Text style={[styles.cell2, { width: columnWidths.allotmentTo }]}>{item.ADDRESS || ""}</Text>
              <Text style={[styles.cell2, { width: columnWidths.allotmentType }]}> {item.USAGE_SUBTYPE || ""}</Text>
              
              {[...Array(6)].map((_, i) => (
                <Text key={i} style={[styles.cell2, { width: "10%" }]}> </Text>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default LeaseRegister;
