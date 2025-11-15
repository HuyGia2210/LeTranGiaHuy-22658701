import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { deleteGrocery, readAllGroceries } from "db/db";
import CardItem from "components/cardItem";
import { Grocery } from "types/Grocery";

const index = () => {
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const db = useSQLiteContext();

  const handleFetch = async () => {
    const list = await readAllGroceries(db);
    setGroceries(list);
  };

  const handleDelete = async (id: number) => {
    await deleteGrocery(db, id);
    await handleFetch();
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <View>
      <FlatList
        data={groceries}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <CardItem data={item} onDelete={handleDelete} />
        )}
      />
    </View>
  );
};

export default index;
