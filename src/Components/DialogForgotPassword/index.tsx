import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Label } from "./styles"; // Usar o mesmo estilo de Label do Dialog
import api from "../../services/api"; // Importar a instância do Axios
// import bcrypt from "bcryptjs"; // Para criptografar a senha no frontend, se necessário para simulação
// Em um ambiente real, a criptografia deve ser no backend.
// Se o backend já criptografa, podemos enviar em texto plano para lá e deixar ele lidar.

interface FormDialogForgotPasswordProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

const FormDialogForgotPassword: React.FC<FormDialogForgotPasswordProps> = ({
  openModal,
  setOpenModal,
}) => {
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const handleClose = () => {
    setOpenModal(false);
    setEmail("");
    setNewPassword("");
    setConfirmNewPassword("");
    setMessage(null);
    setIsError(false);
  };

  const handleSubmit = async () => {
    setMessage(null);
    setIsError(false);

    if (newPassword !== confirmNewPassword) {
      setMessage("As senhas não coincidem. Por favor, verifique.");
      setIsError(true);
      return;
    }

    if (newPassword.length < 6) {
      // Exemplo de validação de tamanho mínimo
      setMessage("A nova senha deve ter pelo menos 6 caracteres.");
      setIsError(true);
      return;
    }

    try {
      // Primeiro, encontre o usuário pelo email
      const userResponse = await api.get("/users/email?email=" + email); // Supondo que você tem um endpoint para buscar usuário por email
      // OU, se você tiver apenas o ID no token, isso seria um desafio.
      // Neste cenário simplificado, vamos procurar o usuário por email.

      if (!userResponse.data) {
        setMessage("Email não encontrado.");
        setIsError(true);
        return;
      }

      const userId = userResponse.data.id;
      //   const hashedPassword = bcrypt.hashSync(newPassword, 8);

      // Agora, use o endpoint de atualização de usuário para mudar a senha
      const updateResponse = await api.put("/users/" + userId, {
        password: newPassword,
      });

      setMessage(
        updateResponse.data.message || "Senha atualizada com sucesso!"
      );
      setIsError(false);
      // Opcional: fechar o modal automaticamente após sucesso
      // setTimeout(() => handleClose(), 3000);
    } catch (error: any) {
      setMessage("Erro ao atualizar a senha. Tente novamente.");
      setIsError(true);
    }
  };

  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogTitle>Redefinir Senha</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Por favor, insira seu email e a nova senha.
        </DialogContentText>
        <Label>Email</Label>
        <TextField
          autoFocus
          margin="dense"
          id="email-forgot-password"
          type="email"
          fullWidth
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Label>Nova Senha</Label>
        <TextField
          margin="dense"
          id="new-password"
          type="password"
          fullWidth
          variant="standard"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Label>Confirmar Nova Senha</Label>
        <TextField
          margin="dense"
          id="confirm-new-password"
          type="password"
          fullWidth
          variant="standard"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
        {message && (
          <p style={{ color: isError ? "red" : "green", marginTop: "10px" }}>
            {message}
          </p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          disabled={!email || !newPassword || !confirmNewPassword}
        >
          Redefinir Senha
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialogForgotPassword;
