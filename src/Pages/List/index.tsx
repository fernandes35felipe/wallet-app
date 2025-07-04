import React, { useMemo, useState, useEffect } from "react";
import {
  Container,
  Content,
  Filters,
  ButtonContainer,
  AddButton,
} from "./styles";
import ContentHeader from "../../Components/ContentHeader";
import SelectInput from "../../Components/SelectInput";
import HistoryFinanceCard from "../../Components/HistoryFinanceCard";
import formatCurrency from "../../Components/utils/formatCurrency";
import listOfMonths from "../../Components/utils/months";
import api from "../../services/api";
import moment from "moment";
import FormDialog from "../../Components/Dialog";

interface IRouteParams {
  match: {
    params: {
      type: string;
    };
  };
}

interface IData {
  id: string;
  description: string;
  amountFormatted: string;
  frequency: string;
  dateFormatted: string;
  tagColor: string;
  name: string;
  group_id?: number;
}

const List: React.FC<IRouteParams> = ({ match }) => {
  const [data, setData] = useState<IData[]>([]);
  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const [yearSelected, setYearSelected] = useState<number>(
    +moment().format("YYYY")
  );
  const [selectedFrequency, setSelectedFrequency] = useState([
    "recurrent",
    "eventual",
  ]);
  const [expenses, setExpenses] = useState<any>([]);
  const [gains, setGains] = useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);

  const { type } = match.params;

  const listData = useMemo(() => {
    return type === "entry-balance" ? gains : expenses;
  }, [type, gains, expenses]);

  useEffect(() => {
    const updateGroupId = () => {
      const storedGroupId = localStorage.getItem(
        "@minha-carteira:currentGroupId"
      );
      setCurrentGroupId(storedGroupId ? Number(storedGroupId) : null);
    };

    updateGroupId();
    window.addEventListener("storage", updateGroupId);

    return () => {
      window.removeEventListener("storage", updateGroupId);
    };
  }, []);

  useEffect(() => {
    getAllData();
  }, [open, currentGroupId, monthSelected, yearSelected, selectedFrequency]);

  const getAllData = async () => {
    const userId = localStorage.getItem("@minha-carteira:userId");
    if (!userId) return;

    const queryParams = new URLSearchParams();
    queryParams.append("month", String(monthSelected));
    queryParams.append("year", String(yearSelected));
    selectedFrequency.forEach((freq) => queryParams.append("frequency", freq));

    if (currentGroupId !== null) {
      queryParams.append("groupId", String(currentGroupId));
    }

    let expensesListResponse;
    let entriesListResponse;

    try {
      expensesListResponse = await api.get(
        `/expenses/user/${userId}?${queryParams.toString()}`
      );
      setExpenses(expensesListResponse.data);
    } catch (error) {
      console.error("Erro ao carregar despesas:", error);
      setExpenses([]);
    }

    try {
      entriesListResponse = await api.get(
        `/entries/user/${userId}?${queryParams.toString()}`
      );
      setGains(entriesListResponse.data);
    } catch (error) {
      console.error("Erro ao carregar entradas:", error);
      setGains([]);
    }
  };

  const title = useMemo(() => {
    return type === "entry-balance"
      ? { title: "Entradas", lineColor: "#04ff00" }
      : { title: "Saídas", lineColor: "#E44C4E" };
  }, [type]);

  useEffect(() => {
    const filteredData = listData.filter((item: any) => {
      const itemDate = moment(item.date).format("DD-MM-YYYY");
      const itemYear = +itemDate.substring(6);
      const itemMonth = +itemDate.substring(3, 5);
      const isFrequencySelected = selectedFrequency.includes(item.recurrent);
      const isCorrectMonthAndYear =
        itemMonth === monthSelected && itemYear === yearSelected;
      const isCorrectGroup =
        currentGroupId !== null ? item.group_id === currentGroupId : true;

      return isFrequencySelected && isCorrectMonthAndYear && isCorrectGroup;
    });

    const formattedData = filteredData.map((item: any) => {
      return {
        id: item.id,
        description: item.description,
        amountFormatted: formatCurrency(Number(item.value)),
        frequency: item.recurrent,
        dateFormatted: moment(item.date).format("DD/MM/YYYY"),
        tagColor: item.recurrent === "eventual" ? "#4E41F0" : "#00ccff",
        name: item.name,
        group_id: item.group_id,
      };
    });
    setData(formattedData);
  }, [
    monthSelected,
    yearSelected,
    selectedFrequency,
    listData,
    currentGroupId,
  ]);

  const months = useMemo(() => {
    return listOfMonths.map((month, index) => {
      return {
        value: index + 1,
        label: month,
      };
    });
  }, []);

  const years = useMemo(() => {
    const uniqueYears: number[] = [];
    const thisYear = Number(moment().format("YYYY"));
    uniqueYears.push(thisYear);

    [...gains, ...expenses].forEach((item) => {
      const date = moment(item.date).format("DD-MM-YYYY");
      const year = +date.substring(6);

      if (!uniqueYears.includes(year)) {
        uniqueYears.push(year);
      }
    });

    return uniqueYears.map((year) => {
      return { value: year, label: year };
    });
  }, [expenses, gains]);

  const handleFrequecy = (frequency: string) => {
    const index = selectedFrequency.indexOf(frequency);
    if (index > -1) {
      setSelectedFrequency((prev) => prev.filter((freq) => freq !== frequency));
    } else {
      setSelectedFrequency((prev) => [...prev, frequency]);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <Container>
      <ContentHeader title={title.title} lineColor={title.lineColor}>
        <SelectInput
          options={months}
          onChange={(e) => setMonthSelected(Number(e.target.value))}
          defaultValue={monthSelected}
        />
        <SelectInput
          options={years}
          onChange={(e) => setYearSelected(Number(e.target.value))}
          defaultValue={yearSelected}
        />
      </ContentHeader>

      <Filters>
        <button
          type="button"
          className={`tag-filter tag-filter-recurrent ${
            selectedFrequency.includes("recurrent") ? "active" : ""
          }`}
          onClick={() => handleFrequecy("recurrent")}
        >
          Recorrentes
        </button>
        <button
          type="button"
          className={`tag-filter tag-filter-eventual ${
            selectedFrequency.includes("eventual") ? "active" : ""
          }`}
          onClick={() => handleFrequecy("eventual")}
        >
          Eventuais
        </button>
      </Filters>

      <Content>
        <ButtonContainer>
          <AddButton onClick={handleClickOpen}>{"+"}</AddButton>
        </ButtonContainer>
        {data.map((item) => (
          <HistoryFinanceCard
            key={item.id}
            tagColor={item.tagColor}
            title={item.name}
            subtitle={item.dateFormatted}
            amount={item.amountFormatted}
            type={type}
            id={Number(item.id)}
          />
        ))}
      </Content>
      {open && (
        <FormDialog
          openModal={open}
          setOpenModal={setOpen}
          type={type}
          isEdit={false}
        />
      )}
    </Container>
  );
};

export default List;
