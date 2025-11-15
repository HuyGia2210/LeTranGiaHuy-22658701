import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { deleteGrocery, readAllGroceries, toggleBoughtGrocery } from "db/db";
import CardItem from "components/cardItem";
import { Grocery } from "types/Grocery";
import ModalAddItem from "components/ModalAddItem";
import { TextInput } from "react-native-paper";

const index = () => {
  const [groceries, setGroceries] = useState<Grocery[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<Grocery | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [apiLink, setApiLink] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const db = useSQLiteContext();

  const syncWithAPI = async () => {
    setModalVisible(true);
  };

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

  const handleEdit = (item: Grocery) => {
    setEditingItem(item);
    setOpenAdd(true);
  };

  const filteredGroceries = useMemo(() => {
    if (!searchQuery.trim()) return groceries;
    const lowerQuery = searchQuery.toLowerCase();
    return groceries.filter((g) => g.name.toLowerCase().includes(lowerQuery));
  }, [groceries, searchQuery]);

  const handleSync = async () => {
    setModalVisible(false);
    if (!apiLink) return;

    try {
      const localItems = await readAllGroceries(db);

      // Xóa toàn bộ data trên API
      await fetch(apiLink, { method: "DELETE" });

      for (const item of localItems) {
        await fetch(apiLink, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      }

      Alert.alert("Đồng bộ thành công!");
    } catch (err) {
      Alert.alert("Lỗi đồng bộ", String(err));
    }
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

      <TouchableOpacity
        onPress={() => syncWithAPI()}
        style={{ alignSelf: "flex-end", marginBottom: 10 }}
      >
        <Text style={{ fontSize: 28 }}>SYNC</Text>
      </TouchableOpacity>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Tìm kiếm món..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
          marginBottom: 12,
        }}
      />

      {/* Empty state */}
      {groceries.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Danh sách trống, thêm món cần mua nhé!
        </Text>
      ) : (
        <FlatList
          data={filteredGroceries}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => (
            <CardItem
              data={item}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onEdit={handleEdit}
            />
          )}
        />
      )}

      {/* Modal thêm mới */}
      <ModalAddItem
        visible={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdded={handleFetch}
        editingItem={editingItem}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000000aa",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <Text>Nhập link API</Text>
            <TextInput
              value={apiLink}
              onChangeText={setApiLink}
              placeholder="https://mockapi.io/..."
              style={{ borderWidth: 1, padding: 8, marginVertical: 12 }}
            />
            <Button title="Đồng bộ" onPress={handleSync} />
            <Button title="Hủy" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default index;
