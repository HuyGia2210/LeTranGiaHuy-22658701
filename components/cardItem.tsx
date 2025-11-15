import { View, Text } from "react-native";
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
      <Card.Actions>
        <Button mode="contained" onPress={() => onToggle(data.id)}>
          Toggle Bought
        </Button>
        <Button mode="contained" onPress={() => onEdit(data)}>
          Update
        </Button>
        <Button mode="contained" onPress={() => onDelete(data.id)}>
          Delete
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default CardItem;
