import { View, Text } from "react-native";
import React from "react";
import { Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { Grocery } from "types/Grocery";

type Props = {
  data: Grocery;
  onDelete: (id: number) => void;
};

const CardItem = ({ data, onDelete }: Props) => {
  const router = useRouter();

  return (
    <View>
      <Card>
        <Card.Title title={data.name}></Card.Title>
        <Card.Content>
          <Text>Quantity: {data.quantity}</Text>
          <Text>Category: {data.category}</Text>
          <Text>Bought: {data.bought === 1 ? "Yes" : "No"}</Text>
          <Text></Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Update</Button>
          <Button mode="contained" onPress={() => onDelete(data.id)}>
            Delete
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default CardItem;
