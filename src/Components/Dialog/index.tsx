import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Checkbox } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Label } from "./styles";
import api from "../../services/api";
import SelectInput from "../SelectInput";

export default function FormDialog(props: any) {
  const { openModal, setOpenModal, type, isEdit, itemId } = props;

  const [name, setName] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [value, setValue] = useState<number | undefined>();
  const [date, setDate] = useState<string | undefined>();
  const [recurrent, setRecurrent] = useState<string>("eventual");
  const [checkRecurrent, setCheckRecurrent] = useState<boolean>(false);
  const [recurrenceTime, setRecurrenceTime] = useState<number>(1);
  const [font, setFont] = useState<string | undefined>();
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>();
  const [initialGroupId, setInitialGroupId] = useState<number | undefined>();

  const [groupName, setGroupName] = useState<string | undefined>();
  const [groupDescription, setGroupDescription] = useState<
    string | undefined
  >();
  const [groupTagname, setGroupTagname] = useState<string | undefined>();

  async function getData() {
    const endpoint = type === "entry-balance" ? "/entries/" : "/expenses/";
    try {
      const { data } = await api.get(endpoint + itemId);
      setName(data.name);
      setValue(data.value);
      setDescription(data.description);
      setDate(data.date);
      setFont(data.font);
      setRecurrenceTime(data.recurrence_time);
      setCheckRecurrent(data.recurrent === "recurrent");
      if (data.group_id) {
        setInitialGroupId(data.group_id);
        const groupResponse = await api.get("/groups");
        const group = groupResponse.data.find(
          (g: any) => g.id === data.group_id
        );
        if (group) {
          setSelectedGroup(group.tagname);
        }
      } else {
        setSelectedGroup(undefined);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do item:", error);
    }
  }

  async function getGroupsList() {
    const userId = localStorage.getItem("@minha-carteira:userId");
    if (userId) {
      try {
        const { data } = await api.get("/groups/user/" + userId);
        const options = data.map((group: any) => ({
          label: group.name,
          value: group.id,
          tagname: group.tagname,
        }));
        setGroups(options);

        if (!selectedGroup && options.length > 0) {
          setSelectedGroup(options[0].tagname);
        } else if (options.length === 0 && type !== "group-creation") {
          alert("Você precisa criar um grupo antes de adicionar lançamentos.");
        }
      } catch (error) {
        console.error("Erro ao carregar grupos:", error);
        setGroups([]);
      }
    }
  }

  useEffect(() => {
    if (type !== "group-creation") {
      getGroupsList();
    }
  }, [type, openModal]);

  useEffect(() => {
    if (isEdit && type !== "group-creation") {
      getData();
    }
  }, [openModal, type, itemId]);

  function handleCancel() {
    setOpenModal(false);
    setName(undefined);
    setDescription(undefined);
    setValue(undefined);
    setDate(undefined);
    setRecurrent("eventual");
    setCheckRecurrent(false);
    setRecurrenceTime(1);
    setFont(undefined);
    setSelectedGroup(undefined);
    setInitialGroupId(undefined);

    setGroupName(undefined);
    setGroupDescription(undefined);
    setGroupTagname(undefined);
  }

  function handleChangeCheckRecurrent(check: boolean) {
    setCheckRecurrent(check);
    setRecurrent(check ? "recurrent" : "eventual");
    !check && setRecurrenceTime(1);
  }

  const getGroupIdFromSelected = (tagname: string | undefined) => {
    if (!tagname) return undefined;
    const group = groups.find((g) => g.tagname === tagname);
    return group ? group.id : undefined;
  };

  async function handleAddItem() {
    if (type === "group-creation") {
      if (!groupName || !groupDescription || !groupTagname) {
        alert("Por favor, preencha todos os campos do grupo.");
        return;
      }
      try {
        await api.post("/groups", {
          name: groupName,
          descricao: groupDescription,
          tagname: groupTagname,
        });
        alert("Grupo criado com sucesso!");
        handleCancel();
      } catch (error: any) {
        alert("Erro ao criar grupo.");
      }
    } else {
      const groupId = getGroupIdFromSelected(selectedGroup);
      if (!groupId) {
        alert("Por favor, selecione um grupo para o lançamento.");
        return;
      }

      const endpoint = type === "entry-balance" ? "/entries" : "/expenses";
      const payload = {
        name,
        description,
        value,
        date,
        recurrent,
        recurrence_time: recurrenceTime,
        font,
        user_id: Number(localStorage.getItem("@minha-carteira:userId")),
        group_id: groupId,
      };

      api
        .post(endpoint, payload)
        .then((e) => {
          alert(
            type === "entry-balance"
              ? "Entrada registrada com sucesso!"
              : "Saída registrada com sucesso!"
          );
          setOpenModal(false);
          window.location.reload();
        })
        .catch((error) => alert("Erro ao registrar."));
    }
  }

  function handleDeleteItem() {
    const endpoint = type === "entry-balance" ? "/entries/" : "/expenses/";
    api
      .delete(endpoint + itemId)
      .then((e) => {
        alert(
          type === "entry-balance"
            ? "Entrada excluída com sucesso!"
            : "Saída excluída com sucesso!"
        );
        setOpenModal(false);
        window.location.reload();
      })
      .catch((error) => alert("Erro ao excluir."));
  }

  async function handleEditItem() {
    if (type === "group-creation") {
      alert("Edição de grupos não implementada neste modal.");
      return;
    }

    const groupId = getGroupIdFromSelected(selectedGroup);
    if (!groupId) {
      alert("Por favor, selecione um grupo para o lançamento.");
      return;
    }

    const endpoint = type === "entry-balance" ? "/entries/" : "/expenses/";
    const payload = {
      name,
      description,
      value,
      date,
      recurrent,
      recurrence_time: recurrenceTime,
      font,
      group_id: groupId,
    };

    try {
      await api.put(endpoint + itemId, payload);
      alert(
        type === "entry-balance"
          ? "Entrada atualizada com sucesso!"
          : "Saída atualizada com sucesso!"
      );
      setOpenModal(false);
      window.location.reload();
    } catch (error: any) {
      alert("Erro ao atualizar.");
    }
  }

  return (
    <div>
      <Dialog open={openModal} onClose={handleCancel}>
        {type === "group-creation" ? (
          <DialogTitle>Novo Grupo</DialogTitle>
        ) : (
          <DialogTitle>
            {type === "entry-balance" ? "Entrada" : "Gasto"}
          </DialogTitle>
        )}
        <DialogContent>
          {type === "group-creation" ? (
            <>
              <DialogContentText>
                Crie um novo grupo para organizar suas finanças.
              </DialogContentText>
              <Label>Nome do Grupo</Label>
              <TextField
                autoFocus
                margin="dense"
                id="group-name"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName || ""}
                required
              />
              <Label>Descrição do Grupo</Label>
              <TextField
                margin="dense"
                id="group-description"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setGroupDescription(e.target.value)}
                value={groupDescription || ""}
                required
              />
              <Label>Tag do Grupo (identificador único)</Label>
              <TextField
                margin="dense"
                id="group-tagname"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setGroupTagname(e.target.value)}
                value={groupTagname || ""}
                required
              />
            </>
          ) : (
            <>
              <DialogContentText>
                {type === "entry-balance"
                  ? "Cadastro de nova entrada"
                  : "Cadastro de novo gasto"}
              </DialogContentText>
              <Label>Nome</Label>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setName(e.target.value)}
                value={name || ""}
                required
              />
              <Label>Descrição</Label>
              <TextField
                margin="dense"
                id="description"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setDescription(e.target.value)}
                value={description || ""}
              />
              <Label>Valor</Label>
              <TextField
                margin="dense"
                id="value"
                type="number"
                fullWidth
                variant="standard"
                onChange={(e) => setValue(Number(e.target.value))}
                value={value || ""}
                required
              />
              <Label>Data</Label>
              <TextField
                margin="dense"
                id="date"
                type="date"
                fullWidth
                variant="standard"
                onChange={(e) => setDate(e.target.value)}
                value={date || ""}
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkRecurrent}
                    onChange={() => handleChangeCheckRecurrent(!checkRecurrent)}
                  />
                }
                label="Item recorrente"
              />
              {checkRecurrent && (
                <TextField
                  margin="dense"
                  id="recurrenceTime"
                  label="Tempo de recorrência"
                  type="number"
                  fullWidth
                  variant="standard"
                  onChange={(e) => setRecurrenceTime(Number(e.target.value))}
                  value={recurrenceTime}
                />
              )}
              <Label>Origem/Fonte</Label>
              <TextField
                margin="dense"
                id="font"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setFont(e.target.value)}
                value={font || ""}
              />
              <Label>Grupo</Label>
              <SelectInput
                options={groups}
                onChange={(e) => setSelectedGroup(e.target.value)}
                defaultValue={selectedGroup || ""}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancelar</Button>
          {type === "group-creation" ? (
            <Button onClick={handleAddItem}>Criar Grupo</Button>
          ) : isEdit ? (
            <>
              <Button onClick={handleDeleteItem}>Excluir</Button>
              <Button onClick={handleEditItem}>Salvar</Button>
            </>
          ) : (
            <Button onClick={handleAddItem}>Adicionar</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
