import { useState, useEffect, useRef } from "react";
import { Alert, FlatList, TextInput, Keyboard } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { Input } from "@components/input";
import { Button } from "@components/Button";
import { Header } from "@components/header";
import { Filter } from "@components/filter";
import { Highlight } from "@components/highlight";
import { Loading } from "@components/loading";
import { ListEmpty } from "@components/listEmpty";
import { PlayerCard } from "@components/playerCard";
import { ButtonIcon } from "@components/buttonIcons";

import { AppError } from "@utils/AppError";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { PlayerStorageDTO } from "@storage/player/playerStorageDTO";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { playerGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";

type RouterParams = {
  group: string;
};

export function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [team, setTeam] = useState("Time A");
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const route = useRoute();
  const navigation = useNavigation();
  const { group } = route.params as RouterParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert(
        "Nova pessoa",
        "Informe o nome da pessoa para adicionar."
      );
    }
    const newPlayer = {
      name: newPlayerName,
      team,
    };

    try {
      await playerAddByGroup(newPlayer, group);
      newPlayerNameInputRef.current?.blur();
      Keyboard.dismiss();

      setNewPlayerName("");
      fetchPlayersByTeam();
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Nova pessoa", error.message);
      } else {
        Alert.alert("Não possivel adicionar.");
        console.log(error);
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);
      const playersByteam = await playerGetByGroupAndTeam(group, team);
      setPlayers(playersByteam);
    } catch (error) {
      Alert.alert(
        "Pessoas",
        "Não foi possivel carregar as pessoas do time selecionado"
      );
    }finally{
      setIsLoading(false);
    }
  }

  async function handleRemovePlayer(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      Alert.alert("Remover Pessoa", "Não foi possivel remover essa pessoa.");
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate("groups");
    } catch (error) {
      Alert.alert("Remover Turma", "Não foui possível remover a Turma.");
    }
  }

  async function handleGroupRemove() {
    Alert.alert("Remover", "Deseja remover a Turma?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        onPress: () => {
          groupRemove();
        },
      },
    ]);
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />
      <Highlight title={group} subtitle="adicione a galera e separe os times" />
      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon onPress={handleAddPlayer} icon="add" />
      </Form>

      <HeaderList>
        <FlatList
          data={["Time A", "Time B"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumbersOfPlayers>{players.length}</NumbersOfPlayers>
      </HeaderList>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => handleRemovePlayer(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há pessoa nesse time." />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 },
          ]}
        />
      )}
      <Button
        onPress={handleGroupRemove}
        title="Remover Turma"
        type="SECONDARY"
      />
    </Container>
  );
}
