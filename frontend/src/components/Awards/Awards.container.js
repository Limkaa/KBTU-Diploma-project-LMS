import React from "react";
import { useGetSchoolAwardsQuery } from "../../redux/winners/statistics/awardsStatsApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import Header from "../shared/Header/Header";
import styled from "styled-components";
import Profile from "../Dashboard/Profile";
import { Box, Paper, Grid } from "@mui/material";
import Plus from "../../assets/icons/plus.svg";
import Search from "../../assets/icons/search.svg";
import { styled as styledmui } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Input, Empty, Spin, Button, Card, Tag } from "antd";
import AwardAdd from "./AwardAdd";
import {
  useCreateAwardMutation,
  useUpdateAwardMutation,
} from "../../redux/awards/awardsApiSlice";
import { toastify } from "../shared/Toast/Toast";
import AwardUpdate from "./AwardUpdate";
import { EditOutlined, RightOutlined } from "@ant-design/icons";

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
}));

const InputStyled = styled(Input)`
  &.ant-input-affix-wrapper .ant-input {
    background-color: #fafafa;
    border-radius: 10px;
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

const InputDes = styled(Input.TextArea)`
  &.ant-input[disabled] {
    font-size: 13px;
    font-weight: 400;
    font-family: "Open Sans";
    color: #9699a5;
    border: none;
    background-color: white;
    padding: 0;
    cursor: default;
    border-radius: 0px;
    resize: none;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    overflow: hidden;
  }
`;

const InputTitle = styled(Input)`
  &.ant-input[disabled] {
    border: none;
    background-color: white;
    padding: 0;
    cursor: default;
    border-radius: 0px;
    resize: none;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    overflow: hidden;
  }
`;

const CardStyled = styled(Card)`
  &.ant-card .ant-card-body {
    padding: 0;
  }
`;
const AwardsContainer = () => {
  const [schoolAwards, setSchoolAwards] = React.useState();
  const [search, setSearch] = React.useState("");
  const [showAddAward, setShowAddAward] = React.useState(false);
  const [showUpdateAward, setShowUpdateAward] = React.useState(false);
  const [selectedAward, setSelectedAward] = React.useState();

  const navigate = useNavigate();

  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();

  const [createAward] = useCreateAwardMutation();
  const [updateAward] = useUpdateAwardMutation();

  const { data, isLoading, refetch } = useGetSchoolAwardsQuery({
    school_id: user?.school_id,
    search,
  });

  React.useEffect(() => {
    if (data && !isLoading) {
      setSchoolAwards(data);
    }
  }, [data, isLoading]);

  const handleAdd = async (values, isActive) => {
    try {
      await createAward({
        school_id: user?.school_id,
        name: values?.name,
        description: values?.description,
        points: values?.points,
        is_active: isActive,
      })
        .unwrap()
        .then((payload) => {
          refetch();
          setShowAddAward(false);
          toastify("success", "Award Created");
        });
    } catch (err) {
      console.log(err);
      let message = err.data.detail?.non_field_errors[0] ?? "Error";
      toastify("error", message);
    }
  };

  const handleUpdate = async (values, isActive) => {
    try {
      await updateAward({
        award_id: selectedAward?.id,
        name: values?.name,
        description: values?.description,
        points: values?.points,
        is_active: values?.is_active,
      })
        .unwrap()
        .then((payload) => {
          refetch();
          setShowUpdateAward(false);
          toastify("success", "Award Updated");
        });
    } catch (err) {
      console.log(err);
      let message = err.data.detail?.non_field_errors[0] ?? "Error";
      toastify("error", message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Awards"} />
        <Profile />
      </div>
      <Box sx={{ flexGrow: 1, marginTop: 3 }}>
        <div
          style={{
            marginBottom: 25,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <InputStyled
            size="default size"
            placeholder="Search by award name..."
            prefix={<img src={Search} style={{ height: 20, width: 20 }} />}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
          {user?.role === "manager" && (
            <Button
              type="primary"
              style={styles.btnAdd}
              icon={<img src={Plus} style={{ paddingRight: 5 }} />}
              onClick={() => setShowAddAward(true)}
            >
              Create award
            </Button>
          )}
        </div>
        <Spin spinning={isLoading} size="large">
          <Grid
            container
            spacing={{ xs: 3, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 16 }}
          >
            {schoolAwards?.length > 0 ? (
              schoolAwards?.map((item) => (
                <Grid item key={item.id} xs={6} sm={8} md={4}>
                  <CardStyled
                    // className="card"
                    style={styles.card}
                    key={item.id}
                    actions={
                      user?.role === "manager"
                        ? [
                            <EditOutlined
                              key="edit"
                              onClick={() => {
                                setShowUpdateAward(true);
                                setSelectedAward(item);
                              }}
                            />,
                            <RightOutlined
                              key="winners"
                              onClick={() =>
                                navigate(`/awards/${item?.id}/winners`)
                              }
                            />,
                          ]
                        : [
                            <RightOutlined
                              key="winners"
                              onClick={() =>
                                navigate(`/awards/${item?.id}/winners`, {
                                  state: { awardId: item?.id },
                                })
                              }
                            />,
                          ]
                    }
                  >
                    <div style={styles.total}>
                      <div style={styles.totalTitle}>
                        Total winners: {item.issued_total}
                      </div>
                      <InputTitle
                        style={styles.title}
                        value={item?.name}
                        disabled
                      />
                    </div>

                    <div style={{ padding: "5px 20px" }}>
                      <InputDes
                        value={item?.description}
                        disabled
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                        }}
                      />

                      <div style={styles.recentCont}>
                        {item?.recent_winners?.length > 0 && (
                          <>
                            <div style={styles.recentTitle}>
                              Recent winnners
                            </div>
                            {item?.recent_winners?.map((winner) => (
                              <div style={styles.recent} key={winner.id}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => navigate(`../profile/${winner.student.user.id}`)}
                                >
                                  <img
                                    style={styles.img}
                                    src={
                                      winner.student?.user?.avatar
                                        ? winner.student?.user?.avatar
                                        : winner.student?.user?.gender ===
                                          "male"
                                        ? require("../../assets/icons/boy.png")
                                        : require("../../assets/icons/girl.png")
                                    }
                                  />
                                  <div style={styles.name}>
                                    {winner.student?.user?.first_name}{" "}
                                    {winner.student?.user?.last_name}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </CardStyled>
                </Grid>
              ))
            ) : (
              <div style={{ width: "100%", marginTop: 40 }}>
                <Empty />
              </div>
            )}
          </Grid>
        </Spin>
      </Box>
      <AwardAdd
        show={showAddAward}
        setShow={setShowAddAward}
        handle={handleAdd}
      />
      <AwardUpdate
        selected={selectedAward}
        setSelected={setSelectedAward}
        show={showUpdateAward}
        setShow={setShowUpdateAward}
        handle={handleUpdate}
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
  },
  filter: {
    padding: 8,
    justifyContent: "flex-end",
    display: "flex",
  },
  total: {
    fontSize: 15,
    fontWeight: 500,
    color: "rgba(74, 77, 88, 1)",
    backgroundColor: "rgba(240, 247, 255, 1)",
    padding: "12px 20px",
  },
  totalTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: "rgba(22, 58, 97, 0.7)",
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: "#4A4D58",
    backgroundColor: "rgba(240, 247, 255, 1)",
  },
  // title: {
  //   fontSize: 15,
  //   fontWeight: 600,
  //   color: "#4A4D58",
  // },
  card: {
    minHeight: 450,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  recentCont: {
    marginTop: 10,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "rgba(74, 77, 88, 1)",
  },
  name: {
    fontSize: 13,
    fontWeight: 400,
    color: "#4A4D58",
    marginLeft: 7,
  },
  rating: {
    fontSize: 14,
    fontWeight: 600,
    color: "#4A4D58",
  },
  img: {
    width: 28,
    height: 28,
    borderRadius: 120,
    border: "none",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  recent: {
    display: "flex",
    alignItems: "center",
    padding: "5px 20px 5px 10px",
    borderRadius: 8,
    margin: "10px 0px",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    justifyContent: "space-between",
  },
  btn2: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px 8px",
    borderRadius: 8,
    margin: "0px 5px 0px 5px",
    backgroundColor: "white",
    width: "50%",
    fontSize: 14,
    fontWeight: 500,
    color: "#4A4D58",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px 8px",
    borderRadius: 8,
    margin: "0px 5px 0px 5px",
    backgroundColor: "rgba(22, 58, 97, 1)",
    width: "50%",
    fontSize: 14,
    fontWeight: 500,
    color: "white",
  },
  // btn: {
  //   border: "none",
  //   boxShadow: "none",
  //   // display: "flex",
  //   // backgroundColor: "rgba(22, 58, 97, 1)",
  //   // alignItems: "center",
  //   // justifyContent: "center",
  // },
  btnAdd: {
    backgroundColor: "#163A61",
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    display: "flex",
    fontWeight: 500,
    marginLeft: 16,
  },
  moreText: {
    fontSize: 14,
    fontWeight: 600,
    color: "white",
  },
};
export default AwardsContainer;
