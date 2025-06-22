import React, { useMemo, useState, useEffect } from "react";
import { Container, Content } from "./styles";
import ContentHeader from "../../Components/ContentHeader";
import WalletBox from "../../Components/WalletBox";
import SelectInput from "../../Components/SelectInput";
import MessageBox from "../../Components/MessageBox";
import PieChart from "../../Components/PieChart";
import listOfMonths from "../../Components/utils/months";
import happyImg from "../../assets/happy.svg";
import sadImg from "../../assets/sad.svg";
import api from "../../services/api";
import moment from "moment";

interface IRouteParams {
  match: {
    params: {
      type: string;
    };
  };
}

const Dashboard: React.FC<IRouteParams> = ({ match }) => {
  const { type } = match.params;

  const [monthSelected, setMonthSelected] = useState(new Date().getMonth() + 1);
  const [yearSelected, setYearSelected] = useState<any>(
    new Date().getFullYear()
  );
  const [expenses, setExpenses] = useState<any>([]);
  const [gains, setGains] = useState<any>([]);
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);

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
  }, [monthSelected, yearSelected, currentGroupId]);

  const getAllData = async () => {
    const userId = localStorage.getItem("@minha-carteira:userId");
    if (!userId) return;

    const queryParams = new URLSearchParams();
    queryParams.append("month", String(monthSelected));
    queryParams.append("year", String(yearSelected));

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

  const months = useMemo(() => {
    return listOfMonths.map((month, index) => {
      return {
        value: index + 1,
        label: month,
      };
    });
  }, []);

  const years = useMemo(() => {
    let uniqueYears: number[] = [];
    let thisYear = Number(moment().format("YYYY"));
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

  const totalExpenses = useMemo(() => {
    let total: number = 0;
    expenses.forEach((item: any) => {
      try {
        total += Number(item.value);
      } catch {
        throw new Error("Invalid amount");
      }
    });
    return total;
  }, [expenses]);

  const totalGains = useMemo(() => {
    let total: number = 0;
    gains.forEach((item: any) => {
      try {
        total += Number(item.value);
      } catch {
        throw new Error("Invalid amount");
      }
    });
    return total;
  }, [gains]);

  const expensesVersusGains = useMemo(() => {
    const total = totalExpenses + totalGains;
    const gainsPercent = (totalGains / total) * 100;
    const expensesPercent = (totalExpenses / total) * 100;

    const data = [
      {
        name: "Entradas",
        value: totalGains,
        percent: Number(gainsPercent.toFixed(1)),
        color: "#E44C4E",
      },
      {
        name: "Saidas",
        value: totalExpenses,
        percent: Number(expensesPercent.toFixed(1)),
        color: "#F7931B",
      },
    ];

    return data;
  }, [totalGains, totalExpenses]);

  let saldo = totalGains - totalExpenses;

  return (
    <Container>
      <ContentHeader title="Dashboard" lineColor="#F7931B">
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
      <Content>
        <WalletBox
          title="Saldo"
          amount={saldo}
          footerLabel="Atualizado com base nas entradas e saídas"
          icon="dollar"
          color="#4e41f0"
        />
        <WalletBox
          title="Entradas"
          amount={totalGains}
          footerLabel="Atualizado com base nas entradas"
          icon="arrowUp"
          color="#F7931B"
        />
        <WalletBox
          title="Saídas"
          amount={totalExpenses}
          footerLabel="Atualizado com base nas saídas"
          icon="arrowDown"
          color="#e44c4e"
        />
        <MessageBox
          title={saldo > 0 ? "Muito Bem!" : "Cuidado!"}
          description={
            saldo > 0 ? "Seu saldo é positivo" : "Seu saldo não é positivo"
          }
          footerText={
            saldo > 0
              ? "Continue assim, e considere investir seu saldo"
              : "Reveja seus gastos"
          }
          icon={saldo > 0 ? happyImg : sadImg}
        />
        <PieChart data={expensesVersusGains} />
      </Content>
    </Container>
  );
};

export default Dashboard;
