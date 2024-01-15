import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";

import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { playerGetByGroup } from "./playerGetByGroup";
import { PlayerStorageDTO } from "./playerStorageDTO";

export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string) {
  try {
    const storedPlayer = await playerGetByGroup(group);

    const playerAlreadyExists = storedPlayer.filter(player => player.name === newPlayer.name);

    if(playerAlreadyExists.length > 0){
      throw new AppError('Essa pessoa já está adicionanda em um time.')
    }

    const storage = JSON.stringify([...storedPlayer, newPlayer])

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);
  } catch (error) {
    throw error;
  }
}
