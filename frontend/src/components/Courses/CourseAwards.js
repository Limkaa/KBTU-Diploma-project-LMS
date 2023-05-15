import React from "react";
import {
  useGetCourseAwardsStatsQuery,
  useGetSchoolAwardsQuery,
} from "../../redux/winners/statistics/awardsStatsApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import Header from "../shared/Header/Header";
import styled from "styled-components";
import Profile from "../Dashboard/Profile";
import { Box, Paper, Grid } from "@mui/material";
import Plus from "../../assets/icons/star.svg";
import Search from "../../assets/icons/search.svg";
import { styled as styledmui } from "@mui/material/styles";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EditOutlined, RightOutlined } from "@ant-design/icons";
import { Input, Empty, Spin, Button, Card } from "antd";
import { useUpdateAwardMutation } from "../../redux/awards/awardsApiSlice";
import AwardUpdate from "../Awards/AwardUpdate";
import { toastify } from "../shared/Toast/Toast";
import AwardCourseStudent from "../Awards/AwardCourseStudent";
import { useGetCourseStudentsQuery } from "../../redux/courses/coursesApiSlice";
import { useCreateCourseWinnerMutation } from "../../redux/winners/winnersApiSlice";

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

const CourseAwards = () => {
  const { id: courseId } = useParams();
  const [search, setSearch] = React.useState("");
  const [searchAwards, setSearchAwards] = React.useState("");

  const [courseAwards, setCourseAwards] = React.useState("");
  const navigate = useNavigate();
  const { data: user } = useGetAuthUserQuery();
  const [selectedAward, setSelectedAward] = React.useState();
  const [showUpdateAward, setShowUpdateAward] = React.useState(false);
  const [showGiveAward, setShowGiveAward] = React.useState(false);
  const [studentsOptions, setStudentsOptions] = React.useState([]);
  const [studentId, setStudentId] = React.useState("");
  const [awardsOptions, setAwardsOptions] = React.useState([]);
  const [awardId, setAwardId] = React.useState("");
  const [comment, setComment] = React.useState("");

  const { data, isLoading, refetch } = useGetCourseAwardsStatsQuery({
    course_id: courseId,
    search,
  });

  const { data: dataStudents, isLoading: isLoadingStudents } =
    useGetCourseStudentsQuery({
      course_id: courseId,
    });

  const { data: dataAwards, isLoading: isLoadingAwards } =
    useGetSchoolAwardsQuery({
      school_id: user?.school_id,
      search: searchAwards,
    });

  const [updateAward] = useUpdateAwardMutation();

  const [createCourseWinner] = useCreateCourseWinnerMutation();

  React.useEffect(() => {
    if (data && !isLoading) {
      setCourseAwards(data);
    }
  }, [data, isLoading]);

  React.useEffect(() => {
    let arr = [{ value: "", label: "Select student" }];
    if (dataStudents && !isLoadingStudents) {
      dataStudents.forEach((item) => {
        arr.push({
          value: item.id,
          label: item?.user?.first_name + " " + item?.user?.last_name,
        });
      });
      setStudentsOptions(arr);
    }
  }, [dataStudents, isLoadingStudents]);

  React.useEffect(() => {
    let arr = [{ value: "", label: "Select award" }];
    if (dataAwards && !isLoadingAwards) {
      dataAwards.forEach((item) => {
        arr.push({
          value: item.id,
          label: item?.name,
        });
      });
      setAwardsOptions(arr);
    }
  }, [dataAwards, isLoadingAwards]);

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

  const handleCreateCourseWinner = async () => {
    try {
      await createCourseWinner({
        course_id: courseId,
        student: studentId,
        award: awardId,
        comment: comment,
      })
        .unwrap()
        .then((payload) => {
          refetch();
          toastify("success", "Course Winner Created");
          setShowGiveAward(false);
        });
    } catch (err) {
      console.log(err);
      let message = err.data.detail?.non_field_errors[0] ?? "Error";
      toastify("error", message);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, marginTop: 1 }}>
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
        {user?.role === "teacher" && (
          <Button
            type="primary"
            style={styles.btnAdd}
            icon={<img src={Plus} style={{ paddingRight: 5 }} />}
            onClick={() => setShowGiveAward(true)}
          >
            Award student
          </Button>
        )}
      </div>
      <Spin spinning={isLoading} size="large">
        <Grid
          container
          spacing={{ xs: 3, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 16 }}
        >
          {courseAwards?.length > 0 ? (
            courseAwards?.map((item) => (
              <Grid item key={item.id} xs={6} sm={8} md={4}>
                <CardStyled
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
                              navigate(`/courses/${courseId}/winners`, {
                                state: { awardId: item?.id },
                              })
                            }
                          />,
                        ]
                      : [
                          <RightOutlined
                            key="winners"
                            onClick={() =>
                              navigate(`/courses/${courseId}/winners`, {
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
                          <div style={styles.recentTitle}>Recent winnners</div>
                          {item?.recent_winners?.slice(0, 5).map((winner) => (
                            <div style={styles.recent} key={winner.id}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <img style={styles.img} />
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
      <AwardUpdate
        selected={selectedAward}
        setSelected={setSelectedAward}
        show={showUpdateAward}
        setShow={setShowUpdateAward}
        handle={handleUpdate}
      />
      <AwardCourseStudent
        setShow={setShowGiveAward}
        show={showGiveAward}
        studentsOptions={studentsOptions}
        studentId={studentId}
        setStudentId={setStudentId}
        awardId={awardId}
        setAwardId={setAwardId}
        awardsOptions={awardsOptions}
        comment={comment}
        setComment={setComment}
        handle={handleCreateCourseWinner}
      />
    </Box>
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
  card: {
    minHeight: 475,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  des: {
    fontSize: 14,
    fontWeight: 400,
    color: "#9699A5",
  },
  recentCont: {
    marginTop: 10,
  },
  total: {
    fontSize: 15,
    fontWeight: 500,
    color: "rgba(74, 77, 88, 1)",
    backgroundColor: "rgba(240, 247, 255, 1)",
    padding: "12px 20px",
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
    fontSize: 15,
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

export default CourseAwards;
