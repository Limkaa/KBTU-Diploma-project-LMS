import React from "react";
import { useGetSchoolAwardsQuery } from "../../redux/winners/statistics/awardsStatsApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import Header from "../shared/Header/Header";
import styled from "styled-components";
import Profile from "../Dashboard/Profile";
import { Box, Paper, Grid } from "@mui/material";
// import Paper from "@mui/material/Paper";
// import Grid from "@mui/material/Grid";
import Search from "../../assets/icons/search.svg";
import { styled as styledmui } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { Input, Empty, Spin, Button } from "antd";

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
const AwardsContainer = () => {
  const [schoolAwards, setSchoolAwards] = React.useState();
  const [search, setSearch] = React.useState("");

  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();

  const { data, isLoading } = useGetSchoolAwardsQuery({
    school_id: user?.school_id,
  });

  React.useEffect(() => {
    if (data && !isLoading) {
      console.log(data);
      setSchoolAwards(data);
    }
  }, [data, isLoading]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Awards"} />
        <Profile />
      </div>
      <Box sx={{ flexGrow: 1, marginTop: 3 }}>
        <div style={{ marginBottom: 25 }}>
          <InputStyled
            size="default size"
            placeholder="Search..."
            prefix={<img src={Search} style={{ height: 20, width: 20 }} />}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
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
                  <Link
                    // to={`/courses/${item.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Item>
                      <div style={styles.title}>{item?.name}</div>
                      <div style={styles.des}>
                        Description: {item?.description}
                      </div>
                      <div style={styles.recentCont}>
                        <div style={styles.recentTitle}>Recent winnners</div>
                        {item?.recent_winners?.map((winner) => (
                          <div style={styles.recent}>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <img style={styles.img} />
                              <div style={styles.name}>
                                {winner.student?.user?.first_name}{" "}
                                {winner.student?.user?.last_name}
                              </div>
                            </div>
                            <div style={styles.rating}>
                              {winner?.student?.user?.rating}
                            </div>
                          </div>
                        ))}
                        <Button style={styles.btn}>More</Button>
                      </div>
                    </Item>
                  </Link>
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
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: "#4A4D58",
  },
  des: {
    fontSize: 15,
    fontWeight: 500,
    color: "#9699A5",
    marginTop: 4,
  },
  recentCont: {
    marginTop: 10,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "rgba(74, 77, 88, 1)",
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    color: "#4A4D58",
    marginLeft: 5,
  },
  img: {
    width: 40,
    height: 40,
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
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px 8px",
    borderRadius: 8,
    margin: "10px 0px",
    backgroundColor: "rgba(22, 58, 97, 1)",
    width: "100%",
    fontSize: 15,
    fontWeight: 600,
    color: "white",
  },
};
export default AwardsContainer;
