import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Table, Input, Button, Space } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
// import { useGetAcademicYearsQuery } from "../../redux/academicYears/academicYearsApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useGetYearsWithoutPageQuery } from "../../redux/academicYears/academicYearsApiSlice";
import InputLabel from "@mui/material/InputLabel";
import { useGetTermsQuery } from "../../redux/terms/termsApiSlice";
import moment from "moment-timezone";

const TermsContainer = () => {
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();
  const [years, setYears] = React.useState();
  const [terms, setTerms] = React.useState();
  const [search, setSearch] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState();
  const [showAddYear, setShowAddYear] = React.useState(false);
  const [showUpdateYear, setShowUpdateYear] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();

  const { data, isLoading, refetch } = useGetTermsQuery({
    year_id: selectedYear,
    page,
  });

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
      console.log(data);
    }
  }, [data, isLoading, selectedYear]);

  React.useEffect(() => {
    if (dataYears && !isLoadingYears) {
      setYears(dataYears.filter((el) => el.is_active));
    }
  }, [dataYears, isLoadingYears]);

  const columns = [
    {
      title: () => {
        return <>Closed</>;
      },
      width: "1%",
      render: (item) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={
              item?.is_active
                ? require("../../assets/icons/active.png")
                : require("../../assets/icons/inactive.png")
            }
            style={{ width: 16, height: 16 }}
          />
        </div>
      ),
    },
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
        <div>{moment(item.from_date).format("DD.MM.YYYY")}</div>
      ),
    },
    {
      title: () => {
        return <>To date</>;
      },
      width: "20%",
      render: (item) => <div>{moment(item.to_date).format("DD.MM.YYYY")}</div>,
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
              // setSelectedSubject(record);
              // setShowUpdateSubject(true);
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
              defaultValue={""}
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
              // onClick={() => setShowAddSubject(true)}
            >
              Add subject
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
          <h2>Choose year</h2>
        )}
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
};

export default TermsContainer;
