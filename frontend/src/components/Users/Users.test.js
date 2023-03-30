// import React from 'react';
// import {useSelector} from "react-redux";
// import {selectCurrentUser} from "../../redux/auth/authSlice";
// import {useGetUsersQuery} from "../../redux/users/usersApiSlice";

// const UsersTest = () => {
//     const user = useSelector(selectCurrentUser);

//     const {
//         data: users,
//         isLoading,
//         isSuccess,
//         isError,
//         error
//     } = useGetUsersQuery(user.school_id);

//     console.log(users?.results);

//     if (isLoading) {
//         return <p>Loading...</p>;
//     } else {
//         return (
//             <div className='users-list'>
//                 {users?.results.map((user) => {
//                     return <p key={user.id}>{user.email}</p>
//                 })}
//             </div>
//         );
//     }
// };

// export default UsersTest;