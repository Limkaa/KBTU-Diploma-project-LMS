import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header/Header";
import { Table, Input, Button, Space, Tag } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
// import { useGetAcademicYearsQuery } from "../../redux/academicYears/academicYearsApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useGetYearsWithoutPageQuery } from "../../redux/academicYears/academicYearsApiSlice";
import InputLabel from "@mui/material/InputLabel";
import {
  useAddTermMutation,
  useGetTermsQuery,
  useUpdateTermMutation,
} from "../../redux/terms/termsApiSlice";
import moment from "moment-timezone";
import { toastify } from "../shared/Toast/Toast";
import AddTerm from "./AddTerm";
import UpdateTerm from "./UpdateTerm";
import dayjs from "dayjs";

const TermsContainer = () => {
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();
  const [years, setYears] = React.useState();
  const [terms, setTerms] = React.useState();
  const [search, setSearch] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState("");
  const [selectedTerm, setSelectedTerm] = React.useState();

  const [showAddTerm, setShowAddTerm] = React.useState(false);
  const [showUpdateTerm, setShowUpdateTerm] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();

  const { data, isLoading, refetch } = useGetTermsQuery({
    year_id: selectedYear,
    page,
  });

  const [createTerm] = useAddTermMutation();
  const [updateTerm] = useUpdateTermMutation();

  const { data: dataYears, isLoading: isLoadingYears } =
    useGetYearsWithoutPageQuery({
      school_id: user?.school_id,
    });

  React.useEffect(() => {
    if (data && !isLoading) {
      if (page === 1) {
        setTotal(data?.count);
      }
      setTerms(data.results);
    }
  }, [data, isLoading, selectedYear]);

  React.useEffect(() => {
    if (dataYears && !isLoadingYears) {
      setYears(dataYears);
      setSelectedYear(
        dataYears[dataYears?.length - 1]?.id
      );
    }
  }, [dataYears, isLoadingYears]);

  const handleAddTerm = async (values, start, end) => {
    if (user) {
      try {
        await createTerm({
          year: values.year,
          name: values.name,
          from_date: dayjs(start).format("YYYY-MM-DD"),
          to_date: dayjs(end).format("YYYY-MM-DD"),
          is_closed: values.is_closed,
        })
          .unwrap()
          .then((payload) => {
            refetch();
            toastify("success", "Term Created");
          });
      } catch (err) {
        console.log(err);
        let message = err.data.detail?.non_field_errors[0] ?? "Error";
        toastify("error", message);
      }
    }
  };

  const handleUpdateTerm = async (values) => {
    if (user) {
      try {
        await updateTerm({
          term_id: selectedTerm?.id,
          year: values.year,
          name: values.name,
          from_date: values.from_date,
          to_date: values.to_date,
          is_closed: values.is_closed,
        })
          .unwrap()
          .then((payload) => {
            refetch();
            toastify("success", "Term Updated");
          });
      } catch (err) {
        console.log(err);
        let message = err.data.detail?.non_field_errors[0] ?? "Error";
        toastify("error", message);
      }
    }
  };

  const columns = [
    {
      title: () => {
        return <>Name</>;
      },
      width: "20%",
      render: (item) => <div>{item?.name}</div>,
    },
    {
      title: () => {
        return <>From date</>;
      },
      width: "20%",
      render: (item) => (
        <div>{moment(item.from_date).format("DD MMMM YYYY")}</div>
      ),
    },
    {
      title: () => {
        return <>To date</>;
      },
      width: "20%",
      render: (item) => (
        <div>{moment(item.to_date).format("DD MMMM YYYY")}</div>
      ),
    },
    {
      title: "Status",
      width: "15%",
      render: (item) => (
        <Tag
          style={{ minWidth: 70, textAlign: "center" }}
          color={item?.is_closed ? "volcano" : "green"}
        >
          {item?.is_closed ? "Closed" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            style={{ color: "#00899E", fontWeight: 500 }}
            type={"link"}
            onClick={() => {
              setSelectedTerm(record);
              setShowUpdateTerm(true);
            }}
          >
            Change
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoadingYears) {
    return <p>Loading</p>;
  }
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Terms"} />
        <Profile />
      </div>

      <div style={styles.tableCont}>
        <div style={styles.filter}>
          <FormControl
            sx={{ width: 220, fieldset: { borderRadius: "10px" } }}
            size="small"
          >
            <InputLabel id="grade">Year</InputLabel>
            <Select
              labelId="grade"
              id="grade"
              label="Grade"
              defaultValue={selectedYear}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <MenuItem value="" disabled>
                <em>Choose year</em>
              </MenuItem>
              {years?.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div
            style={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Input
              size="default size"
              placeholder="Search..."
              prefix={<img src={Search} style={{ height: 20, width: 20 }} />}
              style={styles.search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
            <Button
              type="primary"
              style={styles.btnAdd}
              icon={<img src={Plus} style={{ paddingRight: 5 }} />}
              onClick={() => setShowAddTerm(true)}
            >
              Create term
            </Button>
          </div>
        </div>
        {selectedYear ? (
          terms ? (
            <Table
              dataSource={terms}
              columns={columns}
              rowKey={(item) => item?.id}
              pagination={{
                total: total,
                current: page,
                onChange: (page) => {
                  setPage(page);
                },
                showSizeChanger: false,
              }}
            />
          ) : (
            <p>Loading</p>
          )
        ) : (
          <p style={styles.choose}>Choose year</p>
        )}
      </div>
      <AddTerm
        showAddTerm={showAddTerm}
        setShowAddTerm={setShowAddTerm}
        years={years}
        handleAddTerm={handleAddTerm}
      />
      <UpdateTerm
        years={years}
        showUpdateTerm={showUpdateTerm}
        setShowUpdateTerm={setShowUpdateTerm}
        term={selectedTerm}
        handleUpdateTerm={handleUpdateTerm}
      />
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 16,
  },
  header: {
    display: "flex",
    flexDirection: "space-between",
  },
  tableCont: {
    marginTop: 20,
    borderRadius: 8,
    border: "1px solid #0000000D",
  },
  filter: {
    padding: 8,
    justifyContent: "space-between",
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
  choose: {
    textAlign: "center",
    padding: 20,
    fontWeight: 500,
    fontSize: 20,
    color: "#00000050",
  },
};

export default TermsContainer;
