import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Content,
  TitleContainer,
  GroupList,
  GroupItem,
  MemberList,
  MemberItem,
  AddMemberContainer,
  MemberActions,
  AdminToggle,
  RemoveButton,
} from "./styles";
import SelectInput from "../../Components/SelectInput";
import api from "../../services/api";
import { getToken } from "../../services/auth"; // Para pegar o ID do usuário logado
import { jwtDecode } from "jwt-decode"; // Para decodificar o token JWT
import { Button, TextField } from "@mui/material";

interface Group {
  id: number;
  name: string;
  tagname: string;
  descricao: string;
  isAdmin: boolean; // Se o usuário logado é admin deste grupo
}

interface Member {
  userId: number;
  email: string;
  name: string;
  isAdmin: boolean;
}

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      setCurrentUserId(decodedToken.id);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [currentUserId]); // Recarrega grupos quando o ID do usuário é definido

  useEffect(() => {
    if (selectedGroup) {
      fetchMembers(selectedGroup.id);
      setUserIsAdmin(selectedGroup.isAdmin); // Define se o usuário logado é admin do grupo selecionado
    } else {
      setMembers([]);
      setUserIsAdmin(false);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    if (!currentUserId) return;
    try {
      const response = await api.get(`/groups/user/${currentUserId}`);
      setGroups(response.data);
      if (response.data.length > 0 && !selectedGroup) {
        setSelectedGroup(response.data[0]); // Seleciona o primeiro grupo por padrão
      }
    } catch (error) {
      console.error("Erro ao buscar grupos:", error);
      setGroups([]);
    }
  };

  const fetchMembers = async (groupId: number) => {
    try {
      const response = await api.get(`/groups/${groupId}/members`);
      setMembers(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar membros do grupo:", error);
      alert("Erro ao carregar membros.");
      setMembers([]);
    }
  };

  const handleAddMember = async () => {
    if (!selectedGroup || !newMemberEmail) return;
    try {
      const response = await api.post(`/groups/${selectedGroup.id}/add-users`, {
        userEmails: [newMemberEmail],
      });
      alert(response.data.message);
      setNewMemberEmail("");
      fetchMembers(selectedGroup.id); // Recarrega a lista de membros
    } catch (error: any) {
      console.error("Erro ao adicionar membro:", error);
      alert("Erro ao adicionar membro.");
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (
      !selectedGroup ||
      !window.confirm("Tem certeza que deseja remover este membro?")
    )
      return;
    try {
      const response = await api.delete(
        `/groups/${selectedGroup.id}/remove-user/${memberId}`
      );
      alert(response.data.message);
      fetchMembers(selectedGroup.id); // Recarrega a lista de membros
    } catch (error: any) {
      console.error("Erro ao remover membro:", error);
      alert("Erro ao remover membro.");
    }
  };

  const handleToggleAdminStatus = async (
    memberId: number,
    currentStatus: boolean
  ) => {
    if (!selectedGroup) return;
    try {
      const response = await api.put(
        `/groups/${selectedGroup.id}/update-admin-status/${memberId}`,
        {
          isAdmin: !currentStatus,
        }
      );
      alert(response.data.message);
      fetchMembers(selectedGroup.id); // Recarrega a lista de membros
    } catch (error: any) {
      console.error("Erro ao atualizar status de admin:", error);
      alert("Erro ao atualizar status de admin.");
    }
  };

  const groupOptions = useMemo(() => {
    return groups.map((group) => ({
      label: group.name,
      value: group.id,
      tagname: group.tagname, // Necessário para o SelectInput
    }));
  }, [groups]);

  const handleSelectGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const groupId = Number(e.target.value);
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
    }
  };

  return (
    <Container>
      <TitleContainer>
        <h1>Gerenciar Grupos</h1>
      </TitleContainer>

      <Content>
        <GroupList>
          <h2>Meus Grupos</h2>
          <SelectInput
            options={groupOptions}
            onChange={handleSelectGroupChange}
            // defaultValue={selectedGroup?.id || ""}
          />
          {selectedGroup && (
            <GroupItem key={selectedGroup.id}>
              <h3>{selectedGroup.name}</h3>
              <p>{selectedGroup.descricao}</p>
              <p>Tag: {selectedGroup.tagname}</p>
              {selectedGroup.isAdmin && (
                <p style={{ color: "green" }}>Você é Administrador</p>
              )}
            </GroupItem>
          )}
        </GroupList>

        {selectedGroup && (
          <MemberList>
            <h2>Membros do Grupo: {selectedGroup.name}</h2>
            {userIsAdmin && ( // Apenas admins podem adicionar
              <AddMemberContainer>
                <TextField
                  label="Email do Novo Membro"
                  variant="standard"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
                <Button onClick={handleAddMember}>Adicionar</Button>
              </AddMemberContainer>
            )}
            <ul>
              {members.map((member) => (
                <MemberItem key={member.userId}>
                  <span>
                    {member.name} ({member.email})
                  </span>
                  <MemberActions>
                    {userIsAdmin &&
                      (member.userId !== currentUserId ||
                        (member.userId === currentUserId &&
                          !member.isAdmin)) && ( // Condição ajustada para permitir que um admin remova a si mesmo se for o único, ou altere o status se for admin e não o único.
                        <>
                          <AdminToggle
                            checked={member.isAdmin}
                            onChange={() =>
                              handleToggleAdminStatus(
                                member.userId,
                                member.isAdmin
                              )
                            }
                            label={member.isAdmin ? "Admin" : "Membro"}
                          />{" "}
                          {/* REMOVA A VÍRGULA AQUI */}
                          <RemoveButton
                            onClick={() => handleRemoveMember(member.userId)}
                          >
                            Remover
                          </RemoveButton>
                        </>
                      )}
                    {/* Lógica para exibir 'Você (Admin)' ou 'Você' para o usuário logado */}
                    {member.isAdmin && member.userId === currentUserId && (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Você (Admin)
                      </span>
                    )}
                    {!member.isAdmin && member.userId === currentUserId && (
                      <span style={{ color: "gray" }}>Você</span>
                    )}
                  </MemberActions>
                </MemberItem>
              ))}
            </ul>
          </MemberList>
        )}
      </Content>
    </Container>
  );
};

export default GroupManagement;
