import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
//import data from './data.json';
import { Font } from "@react-pdf/renderer";

import BengaliFont from "./SolaimanLipi_29-05-06.ttf";
import PropTypes from "prop-types";

Font.register({
  family: "SolaimanLipi",
  src: BengaliFont,
});

const styles = StyleSheet.create({
  cellText: {
    fontFamily: "SolaimanLipi", // Use the registered font family
    fontSize: 12,
    margin: "auto",
    padding: 2,
  },

  page: {
    fontFamily: "SolaimanLipi",
    flexDirection: "row",
    backgroundColor: "white",
  },
  section: {
    margin: 5,
    padding: 5,
    flexGrow: 1,
  },
  headerbox: {
    position: "center",
    top: 10,
    textAlign: "center",
    marginBottom: 5,
  },
  namebox: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subheading: {
    fontSize: 14,
    color: "gray",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
  },
  phoneNumber: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  table: {
    display: "table",
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableRow: { flexDirection: "row" },
  tableCol: {
    width: "6.667%",
    borderStyle: "solid",
    borderWidth: 1,
  },
});

function PdfFile({ list, firmInfo }) {
  // console.log("pdf file " + JSON.stringify(list));
  // const [values, setValues] = useState([]);

  // console.log(firmInfo);
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  const heading = {
    programNo: "সূচি নং", //
    programDate: "সূচি তারিখ", //
    programQuantity: "পরিমাণ", //
    invoiceNo: "ইনভয়েস নং", //
    sendingDate: "প্রেরণের তারিখ", //
    sendingPoint: "প্রেরক কেন্দ্র", //
    receivingPoint: "প্রাপক কেন্দ্র", //
    receivingDate: "প্রাপ্তির তারিখ", //
    commodity: "পণ্য", //
    sendingGrossQuantity: "মোট প্রেরণ ", //
    receivingGrossQuantity: "মোট প্রাপ্ত ", //
    shortage: "ঘাটতি", //
    truckNo: "ট্রাক নং", //
    billNo: "বিল নং", //
    billDate: "বিল তারিখ", //
    govtBillNo: "সরকারি বিল নং", //
    govtBillDate: "সরকারি বিল তারিখ", //
  };

  const tmp = [heading, ...list];
  const updatedJSON = [];

  for (var i = 0; i < tmp?.length; i++) {
    if (i != 0) {
      updatedJSON.push({
        programNo: tmp[i].programNo,
        programDate: new Date(tmp[i].programDate).toLocaleDateString(
          "bn-BD",
          options
        ),
        programQuantity: tmp[i].programQuantity,
        invoiceNo: tmp[i].invoiceNo,
        sendingDate: new Date(tmp[i].sendingDate).toLocaleDateString(
          "bn-BD",
          options
        ),
        sendingPoint: tmp[i].sendingPoint,
        receivingPoint: tmp[i].receivingPoint,
        receivingDate: new Date(tmp[i].receivingDate).toLocaleDateString(
          "bn-BD",
          options
        ),
        commodity: tmp[i].commodity,
        sendingGrossQuantity: tmp[i].sendingGrossQuantity,
        receivingGrossQuantity: tmp[i].receivingGrossQuantity,
        shortage: tmp[i].shortage,
        truckNo: tmp[i].truckNo,
        billNo: tmp[i].bill?.billNo,
        billDate: tmp[i].bill
          ? new Date(tmp[i].bill?.date).toLocaleDateString("bn-BD", options)
          : "",
        govtBillNo: tmp[i].bill?.govtBillNo,
        govtBillDate: tmp[i].bill
          ? new Date(tmp[i].bill?.govtBillDate).toLocaleDateString(
              "bn-BD",
              options
            )
          : "", //
      });
    } else updatedJSON.push(tmp[i]);
  }

  const values = updatedJSON;

  function splitTextIntoChunks(text) {
    const maxChunkLength = 16; // Adjust this value based on your needs
    const chunks = [];
    for (let i = 0; i < text?.toString().length; i += maxChunkLength) {
      chunks.push(text?.toString().substr(i, maxChunkLength));
    }
    return chunks;
  }

  return (
    <Document>
      <Page size="LEGAL" orientation="landscape" style={styles.page}>
        <View style={styles.section}>
          {/* This is Header  */}
          <View style={styles.headerbox}>
            <Text style={styles.heading}> মুভমেন্ট রেজিস্টার </Text>
            <Text style={styles.subheading}>{firmInfo?.name}</Text>
            <Text style={styles.description}> {firmInfo?.address} </Text>
          </View>
          {/* Down Header  */}
          <View style={styles.namebox}>
            {/* <Text style={styles.description}>
              {" "}
              বিল নংঃ {"data.billNo"} তারিখঃ {"data.date"}
            </Text>
            <Text style={styles.description}> বরাবরঃ {"data.submittedTo"}</Text> */}
          </View>

          {/* Phone Number  */}
          <View style={styles.phoneNumber}>
            <Text>ফোনঃ {firmInfo?.phone} </Text>
          </View>

          {/* Table  */}
          <View style={styles.table}>
            {Object.values(values).map((row, rowIndex) => (
              <View key={rowIndex} style={styles.tableRow}>
                {Object.values(row).map((item, indx) => (
                  <View key={indx} style={styles.tableCol}>
                    {splitTextIntoChunks(item).map((chunk, chunkIndex) => (
                      <center key={chunkIndex}>
                        <Text style={styles.cellText}>{chunk}</Text>
                      </center>
                    ))}
                  </View>
                ))}
                <br></br>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

PdfFile.propTypes = {
  list: PropTypes.array, // Adjust the type accordingly
  firmInfo: PropTypes.object,
};

export default PdfFile;
