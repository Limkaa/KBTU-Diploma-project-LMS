import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from "react-router-dom";
import {useTokenObtainMutation} from "../../redux/api/authApiSlice";
import {setCredentials} from "../../redux/auth/authSlice";
// import Alert from "../Alert/Alert";
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {toastify} from "../shared/Toast/Toast";

function Login() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [err, setErr] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [obtainTokens, {isLoading}] = useTokenObtainMutation();

    useEffect(() => {
        setErr('');
    }, [email, password])

    const onFinish = async (values) => {
        console.log('Success:', values);
        let {email, password} = values;
        try {
            const userTokens = await obtainTokens({email, password}).unwrap();
            dispatch(setCredentials({userAccessToken: userTokens.access, userRefreshToken: userTokens.refresh}));
            navigate('/');
        } catch(err) {
            console.log(err);
            if (err.status === 401) {
                toastify("error", "No active account with given credentials");
            } else {
                toastify("error", "Login failed");
            }
        }
    };

    return (
        <div className="form">
            <h1>StudyMate</h1>
            <div className="form-group">
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                    size={"large"}
                    validateTrigger="onSubmit"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Invalid email format!',
                            },
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            {
                                whitespace: true,
                                message: 'Password can not be empty!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password"/>
                    </Form.Item>
                        <div style={{height: 7, margin: 0}}></div>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                </Form>
            </div>
        </div>
    );
}

export default Login;