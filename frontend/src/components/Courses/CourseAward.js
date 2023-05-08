import React from "react";
import Header from "../shared/Header/Header";
import styled from "styled-components";
import Profile from "../Dashboard/Profile";
import { useLocation, useParams } from "react-router-dom";
import {
  useGetCourseWinnersQuery,
  useGetWinnersOfAwardQuery,
} from "../../redux/winners/winnersApiSlice";
import { Spin, Table } from "antd";
import { useGetAwardQuery } from "../../redux/awards/awardsApiSlice";
import { Paper } from "@mui/material";
import { styled as styledmui } from "@mui/material/styles";
import Back from "../shared/Back";

const Item = styledmui(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  fontFamily: "Open Sans",
  fontWeight: 500,
  color: "#4A4D58",
  padding: theme.spacing(2),
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.06)",
  marginTop: 30,
}));

const TableStyled = styled(Table)`
  &.ant-table-wrapper .ant-table-thead > tr > th {
    background-color: rgba(22, 58, 97, 1);
    color: white;
    font-size: 14px;
    font-weight: 500;
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

const CourseAward = () => {
  const { id: courseId } = useParams();
  const location = useLocation();
  let awardId = location?.state?.awardId;
  const [winners, setWinners] = React.useState([]);
  const [award, setAward] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();

  const { data, isLoading } = useGetCourseWinnersQuery({
    course_id: courseId,
    award_id: awardId,
    page,
  });

  console.log(courseId, awardId);

  const { data: dataAward, isLoading: isLoadingAward } = useGetAwardQuery({
    award_id: awardId,
  });

  React.useEffect(() => {
    if (data && !isLoading) {
      setWinners(data?.results);
      setTotal(data.count);
    }
  }, [data, isLoading]);

  React.useEffect(() => {
    if (dataAward && !isLoadingAward) {
      setAward(dataAward);
    }
  }, [dataAward, isLoadingAward]);

  const columns = [
    {
      title: () => {
        return <>Name</>;
      },
      width: "13%",
      render: (item) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img style={styles.img} />
          <div style={styles.name}>
            {item?.student?.user?.first_name} {item?.student?.user?.last_name}
          </div>
        </div>
      ),
    },
    {
      title: () => {
        return <>Grade</>;
      },
      width: "10%",
      render: (item) => (
        <div style={styles.name}>{item?.student?.group?.grade?.name}</div>
      ),
    },
    {
      title: () => {
        return <>Comment</>;
      },
      width: "20%",
      render: (item) => (
        <div style={item?.comment ? styles.commentStyle : {}}>
          {item?.comment}
        </div>
      ),
    },
    {
      title: () => {
        return <>Issued by</>;
      },
      width: "15%",
      render: (item) =>
        item?.issued_by && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img style={styles.img} />
            <div style={styles.name}>
              {item?.issued_by?.first_name} {item?.issued_by?.last_name}
            </div>
          </div>
        ),
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Award"} />
        <Profile />
      </div>
      <Spin spinning={isLoading} size="large">
        <Item>
          <Back />
          <img
            src={require("../../assets/icons/success.png")}
            style={styles.imgReward}
          />
          <div style={styles.title}>{award?.name}</div>
          <div style={styles.des}>{award?.description}</div>
          <div style={styles.coinCont}>
            <img
              src={require("../../assets/icons/coin2.png")}
              style={styles.coin}
            />
            <div style={styles.pointCnt}>+{award?.points}</div>
          </div>
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
    fontSize: 13,
    fontWeight: 500,
    color: "#4A4D58",
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: "#4A4D58",
    marginTop: 10,
  },
  des: {
    fontSize: 14,
    fontWeight: 500,
    color: "#9699A5",
    marginTop: 4,
  },
  point: {
    padding: "8px 10px",
    margin: 10,
    borderRadius: "50%",
    fontSize: 15,
    fontWeight: 600,
    color: "black",
    alignSelf: "center",
  },
  coin: {
    width: 50,
    heigth: 50,
  },
  pointCnt: {
    fontSize: 17,
    fontWeight: 600,
    color: "white",
    position: "absolute",
    zIndex: 100,
  },
  coinCont: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  commentStyle: {
    padding: 10,
    border: "none",
    borderRadius: 6,
    backgroundColor: "rgba(248, 249, 250, 0.5)",
    boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.03)",
    fontSize: 13,
    fontWeight: 500,
    color: "#4A4D58",
  },
  img: {
    width: 35,
    height: 35,
    borderRadius: 120,
    border: "none",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginRight: 10,
  },
};

export default CourseAward;
