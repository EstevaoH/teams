import { useNavigation } from "@react-navigation/native";
import logoImg from "@assets/Logo.png";
import { BackIcon, Container, Logo, BackButton } from "./styles";

type Props = {
  showBackButton?: boolean;
};

export function Header({ showBackButton = false }: Props) {
  const navigation = useNavigation();
  function handleGoBack(){
    navigation.navigate('groups')
  }
  return (
    <Container>
      {showBackButton && (
        <BackButton onPress={handleGoBack}>
          <BackIcon />
        </BackButton>
      )}
      <Logo source={logoImg} />
    </Container>
  );
}
