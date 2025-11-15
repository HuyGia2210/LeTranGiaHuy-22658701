import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { deleteGrocery, readAllGroceries } from "db/db";
import CardItem from "components/cardItem";
import { Grocery } from "types/Grocery";

const index = () => {
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const db = useSQLiteContext();

  const handleFetch = async () => {
    await readAllGroceries(db).then((list) => setGroceries(list));
  };

  const handleDelete = async (id: number) => {
    await deleteGrocery(db, id).then(() => handleFetch());
  };

  return <View></View>;
};

export default index;
