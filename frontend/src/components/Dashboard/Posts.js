import React, {useEffect, useState} from 'react';
import {useGetSchoolPostsQuery} from "../../redux/schoolPosts/schoolPostsApiSlice";
import moment from "moment-timezone";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {Link} from "react-router-dom";
import {Alert, Spin} from "antd";

const Posts = () => {
    const user = useSelector(selectCurrentUser);
    const {
        data: dataPosts,
        isLoading: isLoadingPosts,
        refetch,
    } = useGetSchoolPostsQuery({ school_id: user.school_id });
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (dataPosts && !isLoadingPosts) {
            setPosts(dataPosts.slice(0,1));
        }
    }, [dataPosts, isLoadingPosts]);

    return (
        <div className="announcements">
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <p className="ann-title">Announcements</p>
                <Link to="/school"  style={{color: "#163A61",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                }}>See all</Link>
            </div>
            {/*<Spin spinning={isLoadingPosts}>*/}
                {posts.map(p => (
                    <div key={p.id} className="ann-item">
                        <div style={{ flex: 1 }}>
                            <p className="ann-text">{p.title}</p>
                        </div>
                        <p className="ann-text" style={{ color: "#5C5C5C" }}>
                            {moment(p?.updated_at).format("dddd, DD MMM YYYY")}
                        </p>
                    </div>
                ))}
                {!isLoadingPosts && !posts.length &&
                    <Alert message={"You have no assignments."}/>
                }
            {/*</Spin>*/}
        </div>
    );
};

export default Posts;