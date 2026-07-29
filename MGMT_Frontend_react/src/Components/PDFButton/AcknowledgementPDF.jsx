// RentAcknowledgementPDF.jsx
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
// import logo from "./path-to-logo.png"; // adjust as needed

// Optional: register Marathi font if needed
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
  page: {
    padding: 20,
    fontSize: 10,
  },
  header: {
  flexDirection: "row",
  alignItems: "center",
  borderBottom: "1pt solid black",
  paddingBottom: 10,
  marginBottom: 10,
},

logo: {
  width: 60,
  height: 60,
  marginRight: 10,
},

headerTextBlock: {
  flex: 1,
  alignItems: "center",
},

centerText: {
  fontSize: 14,
  fontWeight:"bold",
  fontFamily: "NotoSansDevanagari", // Optional: use registered font
  textAlign: "center",
  marginBottom: 2,
},
centerbelowText:{
    fontSize: 12,
  textAlign: "center",
  marginBottom: 2,
},
  row: {
    flexDirection: "row",
    marginBottom: 3,
    justifyContent: "space-between",
  },
  column: {
    width: "48%",
  },
  field: {
   flexDirection: "row",
  marginBottom: 8,
  alignItems: "flex-start",
  },
  label: {
    width: "35%",
  },
colon: {
  width: "5%",
  textAlign: "center",
},
  value: {
    width: "60%",
  textAlign: "left",
  },
  footer: {
    textAlign: "right",
    marginTop: 20,
  },
  border: {
    border: "1pt solid black",
    padding: 10,
  },
});

const AcknowledgementPDF = ({ data ,logo,companyName}) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.border}>
        <View style={styles.header}>
  {/* Logo on the left */}
  {logo && (
    <Image src={logo} style={styles.logo} />
  )}

  {/* Text in the center */}
  <View style={styles.headerTextBlock}>
    <Text style={styles.centerText}>
       {companyName}
    </Text>
    <Text style={styles.centerbelowText}>
      Rent Application Acknowledgment Report
    </Text>
  </View>
</View>
      <View style={styles.row}>
  {/* Left Column */}
  <View style={styles.column}>
    <View style={styles.field}>
      <View style={styles.label}><Text>Zone</Text></View>
      <View style={styles.colon}><Text>:</Text></View>
      <View style={styles.value}><Text>{data.ZONENAME}</Text></View>
    </View>

    <View style={styles.field}>
      <View style={styles.label}><Text>Unit No</Text></View>
      <View style={styles.colon}><Text>:</Text></View>
      <View style={styles.value}><Text>{data.UNITNO}</Text></View>
    </View>

    <View style={styles.field}>
      <View style={styles.label}><Text>Party Address</Text></View>
      <View style={styles.colon}><Text>:</Text></View>
      <View style={styles.value}><Text>{data.ADDRESS}</Text></View>
    </View>

    <View style={styles.field}>
      <View style={styles.label}><Text>Aadhar No</Text></View>
      <View style={styles.colon}><Text>:</Text></View>
      <View style={styles.value}><Text>{data.ADHARNO}</Text></View>
    </View>

    <View style={styles.field}>
      <View style={styles.label}><Text>Contact No</Text></View>
      <View style={styles.colon}><Text>:</Text></View>
      <View style={styles.value}><Text>{data.PHONENO}</Text></View>
    </View>

    <View style={styles.field}>
      <View style={styles.label}><Text>Purpose</Text></View>
      <View style={styles.colon}><Text>:</Text></View>
      <View style={styles.value}><Text>{data.PURPOSE}</Text></View>
    </View>

    <View style={styles.field}>
      <View style={styles.label}><Text>Amount to be Paid</Text></View>
      <View style={styles.colon}><Text>:</Text></View>
      <View style={styles.value}><Text>{data.PAYAMOUNT}</Text></View>
    </View>
  </View>

  {/* Right Column */}
  <View style={styles.column}>
    <View style={styles.field}>
      <View style={styles.label}><Text>Property Number</Text></View>
      <View style={styles.colon}><Text>:</Text></View>
      <View style={styles.value}><Text>{data.PROPNO}</Text></View>
    </View>

    <View style={styles.field}>
      <View style={styles.label}><Text>Party Name</Text></View>
      <View style={styles.colon}><Text>:</Text></View>
      <View style={styles.value}><Text>{data.PARTY_NAME}</Text></View>
    </View>

    <View style={styles.field}>
      <View style={styles.label}><Text>Pan Card No</Text></View>
      <View style={styles.colon}><Text>:</Text></View>
      <View style={styles.value}><Text>{data.PANNO}</Text></View>
    </View>
  </View>
</View>


        <Text style={styles.footer}>
     {(() => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
})()}

        </Text>
      </View>
    </Page>
  </Document>
);

export default AcknowledgementPDF;
