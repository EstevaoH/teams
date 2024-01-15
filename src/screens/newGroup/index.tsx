import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Input } from "@components/input";
import { AppError } from "@utils/AppError";
import { Header } from "@components/header";
import { Button } from "@components/Button";
import { Highlight } from "@components/highlight";
import { groupCreate } from "../../storage/group/groupCreate";
import { Container, Content, Icon } from "./styles";
import { Alert } from "react-native";

export function NewGroup() {
  const [group, setGroup] = useState("");

  const navegation = useNavigation();

  async function handleNew() {
    try {
      if(group.trim().length === 0){
        return  Alert.alert("Novo Grupo", "Informe o nome da turma");
      }
      await groupCreate(group);
      navegation.navigate("players", { group });
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Novo Grupo", error.message);
      } else {
        Alert.alert("Novo Grupo", "Não foi possívi, criar um novo group");
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />
        <Highlight
          title="Nova turma"
          subtitle="crie a turma para adicionar as pessoas"
        />
        <Input placeholder="Nome da turma" onChangeText={setGroup} />
        <Button title="Criar" onPress={handleNew} />
      </Content>
    </Container>
  );
}
