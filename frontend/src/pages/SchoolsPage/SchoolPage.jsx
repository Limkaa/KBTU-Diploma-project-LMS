import React from "react";
import Profile from "../../components/Dashboard/Profile";
import Header from "../../components/shared/Header/Header";
import "./SchoolPage.css";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
  useGetSchoolQuery,
  useUpdateSchoolMutation,
} from "../../redux/schools/schoolsApiSlice";
import { useEffect, useState } from "react";
import { Button, Form, Input, Spin } from "antd";
import "react-toastify/dist/ReactToastify.css";
import { toastify } from "../../components/shared/Toast/Toast";

const SchoolPage = () => {
  const user = useSelector(selectCurrentUser);
  const disabled = user.role !== "manager";
  const [updateSchool] = useUpdateSchoolMutation();
  const {
    data: school,
    isLoading,
    isSuccess,
  } = useGetSchoolQuery(user.school_id);
  const [name, setName] = useState(school?.name);
  const [address, setAddress] = useState(school?.address);
  const [desc, setDesc] = useState(school?.description);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isSuccess) {
      setName(school.name);
      setDesc(school.description);
      setAddress(school.address);
      form.setFieldsValue({
        name: school?.name,
        description: school?.description,
        address: school?.address,
      });
    }
  }, [school, isSuccess, form]);

  const onFinish = () => {
    if (
      name === school?.name &&
      address === school?.address &&
      desc === school?.description
    ) {
      toastify("info", "School information has not changed");
    } else {
      updateSchool({
        school_id: user.school_id,
        name,
        address,
        description: desc,
      })
        .unwrap()
        .then((school) => {
          setName(school.name);
          setDesc(school.description);
          setAddress(school.address);
          toastify("success", "School successfully updated");
        })
        .catch(() => {
          toastify("error", "School updating failed");
        });
    }
  };

  return (
    <main className="school">
      <header className="header">
        <Header text={"School"} />
        <Profile />
      </header>
      <section>
        <h1>School information</h1>
        <Spin spinning={isLoading}>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            autoComplete="off"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label="Name:"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input school name!",
                },
                {
                  whitespace: true,
                  message: "Name can not be empty!",
                },
              ]}
            >
              <Input
                className="input"
                readOnly={disabled}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="this field is required"
              />
            </Form.Item>

            <Form.Item
              label="Address:"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input school address!",
                },
                {
                  whitespace: true,
                  message: "Address can not be empty!",
                },
              ]}
            >
              <Input
                className="input"
                readOnly={disabled}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="this field is required"
              />
            </Form.Item>

            <Form.Item label="Description:" name="description">
              <Input
                className="input"
                readOnly={disabled}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </Form.Item>

            {!disabled && (
              <Form.Item
                wrapperCol={{
                  offset: 4,
                  span: 16,
                }}
              >
                <Button className="btn" type="primary" htmlType="submit">
                  Save changes
                </Button>
              </Form.Item>
            )}
          </Form>
        </Spin>
      </section>
    </main>
  );
};

export default SchoolPage;
