import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { createGrocery, updateGrocery } from "db/db";
import { Grocery } from "types/Grocery";

export default function ModalAddItem({
  visible,
  onClose,
  onAdded,
  editingItem,
}: any) {
  const db = useSQLiteContext();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState("");

  useEffect(() => {
    // Khi modal mở với item edit, set giá trị hiện tại
    setName(editingItem?.name || "");
    setQuantity(editingItem?.quantity?.toString() || "1");
    setCategory(editingItem?.category || "");
  }, [editingItem, visible]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Tên món không được để trống");
      return;
    }

    if (editingItem) {
      // UPDATE
      await updateGrocery(db, {
        id: editingItem.id,
        name: name.trim(),
        quantity: parseInt(quantity) || 1,
        category,
        bought: editingItem.bought,
        created_at: editingItem.created_at,
      } as Grocery);
    } else {
      // CREATE
      await createGrocery(db, {
        name: name.trim(),
        quantity: parseInt(quantity) || 1,
        category,
        bought: 0,
        created_at: Date.now(),
      } as Grocery);
    }

    onAdded && onAdded();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 16,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {editingItem ? "Chỉnh sửa món" : "Thêm món"}
          </Text>

          <TextInput
            placeholder="Tên món"
            value={name}
            onChangeText={setName}
            style={{ borderBottomWidth: 1, padding: 4 }}
          />

          <TextInput
            placeholder="Số lượng"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={{ borderBottomWidth: 1, padding: 4 }}
          />

          <TextInput
            placeholder="Danh mục (tùy chọn)"
            value={category}
            onChangeText={setCategory}
            style={{ borderBottomWidth: 1, padding: 4 }}
          />

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity onPress={onClose} style={{ marginRight: 16 }}>
              <Text style={{ color: "red" }}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSave}>
              <Text style={{ color: "blue" }}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
