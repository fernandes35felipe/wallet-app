import React, { useState } from "react";
import { Container, Logo, Form, FormTitle } from "./styles";
import logoImg from "../../assets/logo.svg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { useAuth } from "../../hooks/auth";
import FormDialogForgotPassword from "../../Components/DialogForgotPassword";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] =
    useState<boolean>(false);

  const { signIn } = useAuth();

  const handleSignIn = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setErrorMessage(null);
    try {
      await signIn(email, password);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente."
        );
      }
    }
  };

  const handleOpenForgotPassword = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    setShowForgotPasswordDialog(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPasswordDialog(false);
  };

  return (
    <Container>
      <Logo>
        <img src={logoImg} alt="Minha Carteira" />
        <h2>Minha Carteira</h2>
      </Logo>

      <Form>
        <FormTitle>Entrar</FormTitle>
        <Input
          required
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          required
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type={"submit"} onClick={handleSignIn}>
          Acessar
        </Button>
        {errorMessage && (
          <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
        )}{" "}
        <a
          href={"#"}
          onClick={handleOpenForgotPassword}
          style={{
            marginTop: "10px",
            display: "block",
            textAlign: "center",
            color: "#F7931B",
          }}
        >
          Esqueci minha senha?
        </a>{" "}
        <a
          href={"/newUser"}
          style={{ marginTop: "10px", display: "block", textAlign: "center" }}
        >
          Novo usuário? clique aqui
        </a>
      </Form>
      {showForgotPasswordDialog && (
        <FormDialogForgotPassword
          openModal={showForgotPasswordDialog}
          setOpenModal={handleCloseForgotPassword}
        />
      )}
    </Container>
  );
};

export default SignIn;
