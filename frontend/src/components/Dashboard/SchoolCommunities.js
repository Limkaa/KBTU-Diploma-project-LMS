import React, {useEffect, useState} from "react";
import {useGetSchoolCommunitiesQuery} from "../../redux/communities/communitiesApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {Link} from "react-router-dom";

function SchoolCommunities() {
    const user = useSelector(selectCurrentUser);
    const {data: commData, isSuccess: isCommSuccess}
        = useGetSchoolCommunitiesQuery({schoolId: user.school_id, page: "", isActive: true, order: "", search: ""})
    const [comms, setComms] = useState([]);

    useEffect(() => {
        if (isCommSuccess) {
            setComms(commData.results);
        }
    }, [commData, isCommSuccess])

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: 16,
        paddingTop: 0,
        borderRadius: 8,
        flex: 1,
        overflow: "hidden",
      }}
    >
      <p className="ann-title">School Communities</p>
      <div>
          {
              comms.map((comm, i) => (
              <Link to={`communities/${comm.id}`} key={comm.id}
                  style={{
                      display: "flex",
                      alignItems: "center",
                      outline: "none",
                      border: "none",
                      backgroundColor: "transparent",
                      textDecoration: "none",
                  }}
              >
                  <p style={{ fontSize: 16, color: "#000000", fontWeight: 700 }}>{i+1}</p>
                  <div
                      style={{
                          textAlign: "left",
                          marginLeft: 10,
                          display: "inline-block",
                          lineHeight: 1,
                      }}
                  >
                      <p
                          style={{
                              fontSize: 12,
                              color: "#4A4D58",
                              fontWeight: 600,
                              marginBottom: 0,
                          }}
                      >
                          {comm.name}
                      </p>
                      <p
                          style={{
                              fontSize: 10,
                              color: "#989898",
                              fontWeight: 600,
                              textOverflow: "ellipsis",
                              whiteSpace: "pre-wrap",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                              marginTop: 2,
                          }}
                      >
                          {comm.description}
                      </p>
                  </div>
              </Link>
          ))
          }
          <Link to="communities" style={{color: "#163A61",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
          }}>
              See all
          </Link>
      </div>
    </div>
  );
}

export default SchoolCommunities;
