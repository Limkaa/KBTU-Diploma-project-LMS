import React, {useEffect, useState} from "react";
import {useGetLeaderBoardQuery} from "../../redux/students/studentsApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";

const Leaderboard = () => {
    const user = useSelector(selectCurrentUser);
    const {data: studentsData, isSuccess} =
        useGetLeaderBoardQuery(user.school_id)
    const [students, setStudents] = useState([]);
    const [me, setMe] = useState({});

    useEffect(() => {
        let arr = [];
        if (isSuccess) {
            let cnt = 1;
            for (let s of studentsData) {
                arr.push({
                    id: cnt,
                    name: `${s.user.first_name} ${s.user.last_name}`,
                    rating: s.user.rating,
                })
                if (s.user.id === user.user_id) {
                    setMe({
                        id: cnt,
                        name: `${s.user.first_name} ${s.user.last_name}`,
                        rating: s.user.rating,
                    })
                }
                cnt++;
            }
            setStudents(arr.slice(0,5));
        }
    }, [studentsData, isSuccess])

  return (
    <div style={styles.container}>
      <p className="ann-title">Leader Board</p>
      <div>
          {me.id &&
              <div style={styles.selfCont}>
                  <p style={{ fontSize: 12, color: "#828282", fontWeight: 600 }}>
                      Your position
                  </p>
                  <div
                      style={{
                          display: "flex",
                          alignItems: "center",
                      }}
                  >
                      <p style={{ fontSize: 12, color: "#000000", fontWeight: 600 }}>
                          {me.id}
                      </p>
                      <div
                          style={{
                              display: "flex",
                              marginLeft: 12,
                              justifyContent: "space-between",
                              flex: 1,
                          }}
                      >
                          <div
                              style={{
                                  display: "flex",
                                  alignItems: "center",
                              }}
                          >
                              <img className="ann-img" />
                              <p
                                  style={{
                                      marginLeft: 8,
                                      fontSize: 12,
                                      color: "#000000",
                                      fontWeight: 600,
                                  }}
                              >
                                  {me.name}
                              </p>
                          </div>
                          <p
                              style={{
                                  fontSize: 12,
                                  color: "#000000",
                                  fontWeight: 600,
                              }}
                          >
                              {me.rating}
                          </p>
                      </div>
                  </div>
              </div>
          }
          {
              students.map((s, i) => (
                  <div key={s.id}
                      style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 4,
                          paddingRight: 12,
                          paddingLeft: 12,
                      }}
                  >
                      <p style={{ fontSize: 12, color: "#000000", fontWeight: 600 }}>
                          {i+1}
                      </p>
                      <div
                          style={{
                              display: "flex",
                              marginLeft: 12,
                              justifyContent: "space-between",
                              flex: 1,
                          }}
                      >
                          <div
                              style={{
                                  display: "flex",
                                  alignItems: "center",
                              }}
                          >
                              <img className="ann-img" />
                              <p
                                  style={{
                                      marginLeft: 8,
                                      fontSize: 12,
                                      color: "#000000",
                                      fontWeight: 600,
                                  }}
                              >
                                  {s.name}
                              </p>
                          </div>
                          <p
                              style={{
                                  fontSize: 12,
                                  color: "#000000",
                                  fontWeight: 600,
                              }}
                          >
                              {s.rating}
                          </p>
                      </div>
                  </div>
              ))
          }
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "white",
    padding: 16,
    paddingTop: 0,
    borderRadius: 8,
    flex: 1,
  },
  selfCont: {
    backgroundColor: "rgb(240, 247, 255)",
    borderRadius: 8,
    paddingTop: 1,
    paddingRight: 12,
    paddingLeft: 12,
    paddingBottom: 6,
      marginBottom: 3,
      // border: "1px solid rgb(46, 184, 115)",
  },
};

export default Leaderboard;
