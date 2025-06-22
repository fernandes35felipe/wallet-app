import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Profile,
  Welcome,
  UserName,
  NewGroupButton,
} from "./styles";
import { useTheme } from "../../hooks/theme";
import api from "../../services/api";
import Toggle from "../Toggle";
import emojis from "../utils/emojis";
import SelectInput from "../SelectInput";
import FormDialog from "../Dialog";

const MainHeader: React.FC = () => {
  const { toggleTheme, theme } = useTheme();
  const [darkTheme, setDarkTheme] = useState(() =>
    theme.title === "dark" ? true : false
  );
  const [groups, setGroups] = useState<any>([]);
  const [groupSelected, setGroupSelected] = useState<string | undefined>(
    undefined
  );
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);

  useEffect(() => {
    getGroups();
  }, [showNewGroupModal]);

  const getGroups = async () => {
    const userId = localStorage.getItem("@minha-carteira:userId");
    if (userId) {
      try {
        let groupsList = await api.get("/groups/user/" + userId);
        console.log(groupsList.data);
        const options = groupsList.data.map((group: any) => ({
          label: group.name,
          value: group.id,
          tagname: group.tagname,
        }));
        setGroups(options);

        if (options.length === 0) {
          setShowNewGroupModal(true);
          localStorage.removeItem("@minha-carteira:currentGroupTag");
          localStorage.removeItem("@minha-carteira:currentGroupId");
          setGroupSelected(undefined);
        } else {
          const storedGroupTag = localStorage.getItem(
            "@minha-carteira:currentGroupTag"
          );
          const defaultGroup = storedGroupTag
            ? options.find(
                (opt: { tagname: string }) => opt.tagname === storedGroupTag
              )
            : options[0];

          if (defaultGroup) {
            setGroupSelected(defaultGroup.tagname);
            localStorage.setItem(
              "@minha-carteira:currentGroupTag",
              defaultGroup.tagname
            );
            localStorage.setItem(
              "@minha-carteira:currentGroupId",
              String(defaultGroup.value)
            );
          } else {
            setGroupSelected(options[0].tagname);
            localStorage.setItem(
              "@minha-carteira:currentGroupTag",
              options[0].tagname
            );
            localStorage.setItem(
              "@minha-carteira:currentGroupId",
              String(options[0].value)
            );
          }
        }
      } catch (error) {
        console.error("Erro ao carregar grupos:", error);
        setGroups([]);
        setShowNewGroupModal(true);
        localStorage.removeItem("@minha-carteira:currentGroupTag");
        localStorage.removeItem("@minha-carteira:currentGroupId");
        setGroupSelected(undefined);
      }
    }
  };

  const emoji = useMemo(() => {
    const indice = Math.floor(Math.random() * emojis.length);
    return emojis[indice];
  }, []);

  const handleChangeTheme = () => {
    setDarkTheme(!darkTheme);
    toggleTheme();
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = e.target.value;
    const selectedOption = groups.find((g: any) => g.tagname === selectedTag);

    if (selectedOption) {
      setGroupSelected(selectedOption.tagname);
      localStorage.setItem(
        "@minha-carteira:currentGroupTag",
        selectedOption.tagname
      );
      localStorage.setItem(
        "@minha-carteira:currentGroupId",
        String(selectedOption.value)
      );
    } else {
      console.error("Grupo selecionado não encontrado na lista.");
      setGroupSelected(undefined);
      localStorage.removeItem("@minha-carteira:currentGroupTag");
      localStorage.removeItem("@minha-carteira:currentGroupId");
    }
    window.dispatchEvent(new Event("storage"));
  };

  const handleOpenNewGroupModal = () => {
    setShowNewGroupModal(true);
  };

  const handleCloseNewGroupModal = () => {
    setShowNewGroupModal(false);
  };

  return (
    <>
      <Container>
        <Toggle
          labelLeft="Light"
          labelRight="Dark"
          checked={darkTheme}
          onChange={handleChangeTheme}
        />
        {groups.length > 0 && (
          <SelectInput
            options={groups}
            onChange={handleGroupChange}
            defaultValue={groupSelected}
          />
        )}
        <NewGroupButton onClick={handleOpenNewGroupModal}>+</NewGroupButton>
        <Profile>
          <Welcome>
            {emoji} Olá, {localStorage.getItem("@minha-carteira:name")}{" "}
          </Welcome>
          <UserName></UserName>
        </Profile>
      </Container>
      {showNewGroupModal && (
        <FormDialog
          openModal={showNewGroupModal}
          setOpenModal={handleCloseNewGroupModal}
          type="group-creation"
          isEdit={false}
        />
      )}
    </>
  );
};

export default MainHeader;
