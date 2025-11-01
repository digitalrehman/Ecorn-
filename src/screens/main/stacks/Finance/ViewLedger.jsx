import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialIcons";

export const APPCOLORS = {
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  Primary: "#000000",
  Secondary: "#5a5c6a",
  BarColor: "#000000",
  DARKLIGHTBLUE: "#1a1c22",
  HALFWITE: "#a7a8ba",
  BTN_COLOR: "#000000",
  SKY_BLUE: "#5a5c6a",
  CLOSETOWHITE: "#F1FFFA",
  TEXTFIELDCOLOR: "#EBEBEB",
};

const ViewLedger = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [ledgerData, setLedgerData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://ercon.de2solutions.com/mobile_dash/gl_account_inquiry.php"
      );
      const json = await response.json();

      if (json.status === "true" && Array.isArray(json.data)) {
        const grouped = groupByDate(json.data);
        setLedgerData(grouped);
      }
    } catch (error) {
      console.error("Error fetching ledger data:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupByDate = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const date = item.doc_date;
      if (!groupedData[date]) groupedData[date] = [];
      groupedData[date].push(item);
    });

    return Object.keys(groupedData).map((date) => ({
      date,
      transactions: groupedData[date],
    }));
  };

  const renderTransaction = ({ item }) => {
    const isCredit = parseFloat(item.amount) > 0;

    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.memoText}>{item.memo}</Text>
          {item.reference && (
            <Text style={styles.refText}>{item.reference}</Text>
          )}
          {item.person_name && (
            <Text style={styles.personText}>{item.person_name}</Text>
          )}
        </View>
        <Text
          style={[
            styles.amountText,
            { color: isCredit ? "#00FF88" : "#FF4D4D" },
          ]}
        >
          {isCredit ? "+" : "-"}
          {Math.abs(item.amount)}
        </Text>
      </View>
    );
  };

  const renderSection = ({ item }) => (
    <View>
      <Text style={styles.dateHeader}>
        {moment(item.date).format("dddd, DD MMM YYYY")}
      </Text>
      {item.transactions.map((tx, index) => (
        <View key={index}>{renderTransaction({ item: tx })}</View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={APPCOLORS.WHITE} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={APPCOLORS.BLACK} />

      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation && navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={APPCOLORS.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Transactions</Text>
      </View>

      {/* CONTENT */}
      <ScrollView style={styles.container}>
        <FlatList
          data={ledgerData}
          renderItem={renderSection}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    </View>
  );
};

export default ViewLedger;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: APPCOLORS.BLACK,
  },
  header: {
    backgroundColor: APPCOLORS.BLACK,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: APPCOLORS.WHITE,
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  dateHeader: {
    fontSize: 15,
    color: APPCOLORS.WHITE,
    fontWeight: "bold",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2b2b2b",
  },
  memoText: {
    color: APPCOLORS.WHITE,
    fontSize: 14,
    fontWeight: "500",
  },
  refText: {
    color: "#999",
    fontSize: 12,
  },
  personText: {
    color: "#777",
    fontSize: 12,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    backgroundColor: APPCOLORS.BLACK,
    justifyContent: "center",
    alignItems: "center",
  },
});
