import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { deleteGrocery, readAllGroceries, toggleBoughtGrocery } from "db/db";
import CardItem from "components/cardItem";
import { Grocery } from "types/Grocery";
import ModalAddItem from "components/ModalAddItem";

const index = () => {
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const db = useSQLiteContext();

  const handleFetch = async () => {
    const list = await readAllGroceries(db);
    setGroceries(list);
  };

  const handleDelete = async (id: number) => {
    await deleteGrocery(db, id);
    await handleFetch();
  };

  const handleToggle = async (id: number) => {
    await toggleBoughtGrocery(db, id);
    // Update state local ngay lập tức
    setGroceries((prev) =>
      prev.map((g) => (g.id === id ? { ...g, bought: g.bought ? 0 : 1 } : g))
    );
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Nút thêm */}
      <TouchableOpacity
        onPress={() => setOpenAdd(true)}
        style={{ alignSelf: "flex-end", marginBottom: 10 }}
      >
        <Text style={{ fontSize: 28 }}>＋</Text>
      </TouchableOpacity>

      {/* Empty state */}
      {groceries.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Danh sách trống, thêm món cần mua nhé!
        </Text>
      ) : (
        <FlatList
          data={groceries}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => (
            <CardItem
              data={item}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          )}
        />
      )}

      {/* Modal thêm mới */}
      <ModalAddItem
        visible={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdded={handleFetch}
      />
    </View>
  );
};

export default index;
