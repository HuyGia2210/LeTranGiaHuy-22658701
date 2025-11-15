import { View, Text, Alert, Pressable } from "react-native";
import React from "react";
import { Button, Card } from "react-native-paper";
import { Grocery } from "types/Grocery";

type Props = {
  data: Grocery;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (item: Grocery) => void;
};

const CardItem = ({ data, onDelete, onToggle, onEdit }: Props) => {
  const handleDelete = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa món này không?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", style: "destructive", onPress: () => onDelete(data.id) },
      ],
      { cancelable: true } // quan trọng: cho phép bấm ra ngoài hủy
    );
  };

  return (
    <Card style={{ marginBottom: 12 }}>
      <Card.Title
        title={
          <Text
            style={{
              textDecorationLine: data.bought ? "line-through" : "none",
              fontSize: 18,
            }}
          >
            {data.name} {data.bought ? "✓" : ""}
          </Text>
        }
      />
      <Card.Content>
        <Text>Quantity: {data.quantity}</Text>
        <Text>Category: {data.category}</Text>
        <Text>Bought: {data.bought === 1 ? "Yes" : "No"}</Text>
      </Card.Content>
      <Card.Actions style={{ flexDirection: "row", alignItems: "center" }}>
        <Button mode="contained" onPress={() => onToggle(data.id)}>
          Toggle Bought
        </Button>
        <Button mode="contained" onPress={() => onEdit(data)}>
          Update
        </Button>
        <Pressable
          onPress={handleDelete}
          style={{
            marginLeft: 8,
            paddingVertical: 6,
            paddingHorizontal: 12,
            backgroundColor: "#ffcccc",
            borderRadius: 4,
          }}
        >
          <Text style={{ color: "red", fontWeight: "bold" }}>Delete</Text>
        </Pressable>
      </Card.Actions>
    </Card>
  );
};

export default CardItem;
