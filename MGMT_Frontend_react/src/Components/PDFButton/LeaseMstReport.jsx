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
    // border: 1,
    borderColor: "#000",
    padding: 10,
    fontSize: 9,
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
},

lastCell: {
  borderRightWidth: 0,
},

  footerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  footerCol: {
    width: "50%",
    marginBottom: 2,
  },
});

// Detect PNG vs JPEG
const cleanBase64 = (logo) => {
  if (!logo) return null;
  let raw = logo.trim().replace(/\s/g, "");

  if (raw.startsWith("data:image")) {
    return raw; // already has prefix
  }

  if (raw.startsWith("iVBOR")) {
    // PNG magic number
    return `data:image/png;base64,${raw}`;
  }

  if (raw.startsWith("/9j/")) {
    // JPEG magic number
    return `data:image/jpeg;base64,${raw}`;
  }

  // fallback as jpeg
  return `data:image/jpeg;base64,${raw}`;
};
const PDFPage = ({ companyName, logo,data }) =>  {
 const finalLogo = cleanBase64(logo);

  return (
    <>
  <Page size="A4" style={styles.page}>
    <View style={styles.box}>
      {/* Header */}
       <View style={styles.headerContainer}>
   {finalLogo && (
            <Image src={finalLogo} style={styles.logo} />
          )}
   {/* {logo && <Image src={logo} style={{ width: 60, height: 60 }} />} */}
  <View style={styles.titleContainer}>
    {companyName && <Text style={styles.title}>{companyName}</Text>}
    <Text style={{ textAlign: "center", fontSize: 12, marginBottom: 10 }}>Lease Application Acknowledgment Report</Text>
  </View>
</View>

         <View style={{ borderBottomWidth: 1, borderBottomColor: "#000", marginTop: 10, marginBottom: 10 }} />

  <View style={styles.section}>
    {/* Row 1 */}
   <View style={styles.row}>
  <View style={styles.col}>
    <Text>
      <Text style={styles.label}>Zone: </Text>
      {data.zone}
    </Text>
  </View>
  <View style={styles.col}>
    <Text>
      <Text style={styles.label}>Allotment Number: </Text>
      <Text style={{ fontSize: 8 }}>{data.allotNo}</Text>
    </Text>
  </View>
  <View style={styles.col}>
    <Text>
      <Text style={styles.label}>Party Name: </Text>
      {data.partyName}
    </Text>
  </View>
</View>


    {/* Row 2 */}
    <View style={styles.row}>
      <View style={styles.col}><Text><Text style={styles.label}>Caste</Text>: {data.caste}</Text></View>
      <View style={styles.col}><Text><Text style={styles.label}>Party Address</Text>: {data.partyAddress}</Text></View>
<View style={styles.col}></View>
    </View>

    {/* Row 3 */}
    <View style={styles.row}>
      <View style={styles.col}><Text><Text style={styles.label}>Aadhar No</Text>: {data.aadharNo}</Text></View>
      <View style={styles.col}><Text><Text style={styles.label}>Pan Card No</Text>: {data.panCardNo}</Text></View>
      <View style={styles.col}><Text><Text style={styles.label}>Contact No</Text>: {data.contactNo}</Text></View>
    </View>

    {/* Row 4 */}
    <View style={styles.row}>
      <View style={styles.col}><Text><Text style={styles.label}>Allotment Done To</Text>: {data.allottedTo}</Text></View>
      <View style={styles.col}><Text><Text style={styles.label}>Type of Allotment</Text>: {data.allotmentType}</Text></View>
       <View style={styles.col}><Text><Text style={styles.label}>Nature of Business</Text>: {data.natureOfBusiness}</Text></View>
    </View>

    {/* Table */}
   <View style={styles.table}>
  {/* Header Row */}
  <View style={styles.tableRow}>
    <Text style={[styles.cell, { fontWeight: 'bold' }]}>Property Name</Text>
    <Text style={[styles.cell, { fontWeight: 'bold' }]}>Shop Number</Text>
    <Text style={[styles.cell, { fontWeight: 'bold' }]}>Area</Text>
    <Text style={[styles.cell, { fontWeight: 'bold' }]}>Floor</Text>
    <Text style={[styles.cell, styles.lastCell, { fontWeight: 'bold' }]}>Usage Type</Text>
  </View>

  {/* Data Row */}
  <View style={[styles.tableRow, styles.dataRow]}>
    <Text style={styles.cell}>{data.propertyName}</Text>
    <Text style={styles.cell}>{data.shopNumber}</Text>
    <Text style={styles.cell}>{data.area}</Text>
    <Text style={styles.cell}>{data.floor}</Text>
    <Text style={[styles.cell, styles.lastCell]}>{data.usageType}</Text>
  </View>
</View>



    {/* Footer Info */}
    <View style={styles.footerRow}>
      <View style={styles.row}>
      <View style={styles.footerCol}><Text><Text style={styles.label}>Agreement Period</Text>: {data.agreementPeriod} Months</Text></View>
      <View style={styles.footerCol}><Text><Text style={styles.label}>Start Date</Text>: {data.startDate}</Text></View>
      <View style={styles.footerCol}><Text><Text style={styles.label}>End Date</Text>: {data.endDate}</Text></View>
    </View>
     <View style={styles.row}>
      <View style={styles.footerCol}><Text><Text style={styles.label}>Rent Per Month</Text>: {data.rentPerMonth}</Text></View>
      <View style={styles.footerCol}><Text><Text style={styles.label}>Rent Increment</Text>: {data.rentIncrement}</Text></View>
      <View style={styles.footerCol}><Text><Text style={styles.label}>Increment Type</Text>: {data.incrementType}</Text></View>
    </View>
  <View style={styles.row}>
      <View style={styles.footerCol}><Text><Text style={styles.label}>Increment</Text>: {data.increment}</Text></View>
      <View style={styles.footerCol}><Text><Text style={styles.label}>Payment Terms</Text>: {data.paymentTerms}</Text></View>
      <View style={styles.footerCol}><Text><Text style={styles.label}></Text></Text></View>
      </View>
       <View style={styles.row}>
      <View style={styles.footerCol}><Text><Text style={styles.label}>Billing Method</Text>: {data.billingMethod}</Text></View>
      <View style={styles.footerCol}><Text><Text style={styles.label}>Security Deposite</Text>: {data.secDepo}</Text></View>
      <View style={styles.footerCol}><Text><Text style={styles.label}>Rent Per Year or Annual Rent</Text>: {data.annualRent}</Text></View>
    </View>
    </View>
  </View>
  </View>
  </Page>
</>
)
};

const LeaseMstReport = ({ pageData = [] }) => (
  <Document>
    {pageData.map((data, index) => (
      <PDFPage
        key={index}
        companyName={data.companyName}
        companyNameMarathi = {data.companyNameMarathi}
        logo={data.logo}
        data={data.data}
      />
    ))}
  </Document>
);

export default LeaseMstReport;
