import React from "react";
import Header from "../shared/Header/Header";
import styled from "styled-components";
import Profile from "../Dashboard/Profile";
import { useLocation } from "react-router-dom";
import { useGetWinnersOfAwardQuery } from "../../redux/winners/winnersApiSlice";
import { Spin, Table } from "antd";
import { useGetCourseQuery } from "../../redux/courses/coursesApiSlice";
import { useGetAwardQuery } from "../../redux/awards/awardsApiSlice";
import { Box, Paper, Grid } from "@mui/material";

import Search from "../../assets/icons/search.svg";
import { styled as styledmui } from "@mui/material/styles";

const Item = styledmui(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  fontFamily: "Open Sans",
  fontSize: 18,
  fontWeight: 500,
  padding: theme.spacing(2),
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  color: "black",
  boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.06)",
  marginTop: 20,
}));

const TableStyled = styled(Table)`
  &.ant-table-wrapper .ant-table-thead > tr > th {
    background-color: rgba(160, 145, 255, 0.37);
  }
  &.ant-input-affix-wrapper {
    background-color: #fafafa;
    height: 40px;
    width: 280px;
    border: 1px solid #c0c0c0;
    border-radius: 10px;
    background-color: #fafafa;
    margin-right: 15px;
  }
`;

const Award = () => {
  const location = useLocation();
  let awardId = location?.state?.awardId;
  const [winners, setWinners] = React.useState([]);
  const [award, setAward] = React.useState([]);

  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();

  const { data, isLoading } = useGetWinnersOfAwardQuery({
    award_id: awardId,
    page,
  });

  //   const { data, isLoading } = useGetCourseQuery({ id: courseId });

  const { data: dataAward, isLoading: isLoadingAward } = useGetAwardQuery({
    award_id: awardId,
  });

  React.useEffect(() => {
    if (data && !isLoading) {
      setWinners(data?.results);
      console.log(data);
      setTotal(data.count);
    }
  }, [data, isLoading]);

  React.useEffect(() => {
    if (dataAward && !isLoadingAward) {
      setAward(dataAward);
      console.log(dataAward);
    }
  }, [dataAward, isLoadingAward]);

  const columns = [
    {
      title: () => {
        return <>Name</>;
      },
      width: "20%",
      render: (item) => (
        <div>
          {item?.student?.user?.first_name} {item?.student?.user?.last_name}
        </div>
      ),
    },
    {
      title: () => {
        return <>Grade</>;
      },
      width: "25%",
      render: (item) => <div>{item?.student?.group?.grade?.name}</div>,
    },
    {
      title: () => {
        return <>Hours</>;
      },
      width: "10%",
      render: (item) => <div>{item?.hours}</div>,
    },
    // {
    //   title: () => {
    //     return <>Status</>;
    //   },
    //   width: "15%",
    //   render: (item) => (
    //     <div
    //       style={{
    //         ...styles.status,
    //         color: item.is_completed ? "#45B764" : "#969696",
    //       }}
    //     >
    //       {item.is_completed ? "Completed" : "Not yet"}
    //     </div>
    //   ),
    // },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Award"} />
        <Profile />
      </div>
      <Spin spinning={isLoading} size="large">
        <Item>
          <img
            src={require("../../assets/icons/reward.png")}
            style={styles.imgReward}
          />
          <div style={styles.title}>{award?.name}</div>
          <div style={styles.des}>{award?.description}</div>
          <div style={styles.point}>Points: +{award?.points}</div>
          <TableStyled
            dataSource={winners}
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
        </Item>
      </Spin>
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
  },
  filter: {
    padding: 8,
    justifyContent: "flex-end",
    display: "flex",
  },
  imgReward: {
    width: 45,
    heigth: 45,
    alignSelf: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    color: "#4A4D58",
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    color: "#4A4D58",
    marginTop: 10,
  },
  des: {
    fontSize: 15,
    fontWeight: 500,
    color: "#9699A5",
    marginTop: 4,
  },
  point: {
    // backgroundColor: "rgba(160, 145, 255, 0.5)",
    padding: "8px 10px",
    margin: 10,
    borderRadius: "50%",
    fontSize: 15,
    fontWeight: 600,
    color: "black",
    alignSelf: "center",
  },
};

export default Award;
