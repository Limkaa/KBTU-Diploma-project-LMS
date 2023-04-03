import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Table, Input, Button, Space } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import { toast } from "react-toastify";
import { useGetAcademicYearsQuery } from "../../redux/academicYears/academicYearsApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";

const Terms = () => {
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();
  const [years, setYears] = React.useState();
  const [search, setSearch] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState();
  const [showAddYear, setShowAddYear] = React.useState(false);
  const [showUpdateYear, setShowUpdateYear] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();

  const { data, isLoading, refetch } = useGetAcademicYearsQuery({
    school_id: user?.school_id,
    page,
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Academic Years"} />
        <Profile />
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#FAFAFA",
    padding: 16,
  },
  header: {
    display: "flex",
  },
  tableCont: {
    marginTop: 20,
    borderRadius: 8,
    border: "1px solid #0000000D",
  },
  filter: {
    padding: 8,
    justifyContent: "flex-end",
    display: "flex",
  },
  btnAdd: {
    backgroundColor: "#163A61",
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    display: "flex",
    fontWeight: 500,
    marginLeft: 16,
  },
  search: {
    height: 40,
    width: 280,
    border: "none",
    borderRadius: 8,
  },
};

export default Terms;
