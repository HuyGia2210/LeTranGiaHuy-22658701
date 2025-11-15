import { Icon } from "react-native-paper";
import "../global.css";
import { Slot, Tabs } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SQLiteProvider } from "expo-sqlite";
import { createTable } from "db/db";
import { Text } from "react-native";

export default function Layout() {
  return (
    <SQLiteProvider databaseName="grocery.db" onInit={(db) => createTable(db)}>
      <SafeAreaProvider>
        <SafeAreaView className="flex flex-1">
          <Text className="text-xl">Grocery List</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
