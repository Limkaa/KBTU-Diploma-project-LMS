import React from "react";
import { Form, Input, Select } from "antd";
import PropTypes from "prop-types";
import moment from "moment";

const UserForm = ({
  form,
  nickname,
  email,
  password,
  gender,
  phoneNumber,
  birthday,
  role,
}) => {
  const [userRole, setUserRole] = React.useState(role);
  const FormItem = Form.Item;

  return (
    <Form form={form} layout="vertical" hideRequiredMark>
      <FormItem
        key="nickname"
        label="Никнейм пользователя"
        name="nickname"
        rules={[
          {
            required: true,
            message: `Пожалуйста, введите Никнейм`,
          },
        ]}
        initialValue={nickname}
      >
        <Input placeholder="Никнейм" />
      </FormItem>
      <FormItem
        key="email"
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: `Пожалуйста, введите email`,
          },
        ]}
        initialValue={email}
      >
        <Input placeholder="Email" type="email" />
      </FormItem>
      <FormItem
        key="password"
        label="Пароль"
        name="password"
        rules={[
          {
            required: true,
            message: `Пожалуйста, введите пароль`,
          },
        ]}
      >
        <Input placeholder="Пароль" type="password" />
      </FormItem>
      <FormItem
        key="gender"
        label="Пол"
        name="gender"
        rules={[
          {
            required: true,
            message: `Пожалуйста, введите пол`,
          },
        ]}
        initialValue={gender}
      >
        <Select placeholder="Выберите пол" mode="single">
          <Select.Option key="male" value="male">
            Мужской
          </Select.Option>
          <Select.Option key="female" value="female">
            Женский
          </Select.Option>
        </Select>
      </FormItem>

      <FormItem
        key="role"
        label="Роль"
        name="role"
        rules={[
          {
            required: true,
            message: `Пожалуйста, введите роль`,
          },
        ]}
        initialValue={role}
      >
        <Select
          placeholder="Выберите роль"
          mode="single"
          onChange={(value) => setUserRole(value)}
        >
          <Select.Option key="manager" value="manager">
            admin
          </Select.Option>
          <Select.Option key="teacher" value="teacher">
            user
          </Select.Option>
          <Select.Option key="student" value="stident">
            doctor
          </Select.Option>
        </Select>
      </FormItem>
      <FormItem
        key="phoneNumber"
        label="Номер (не обязательно)"
        name="phoneNumber"
        rules={[
          {
            required: false,
          },
        ]}
        initialValue={phoneNumber}
      >
        <Input placeholder="Номер телефона" type="tel" />
      </FormItem>
      <FormItem
        key="birthday"
        label="День Рождения (не обязательно)"
        name="birthday"
        rules={[
          {
            required: false,
          },
        ]}
        initialValue={birthday && moment(birthday).format("YYYY-MM-DD")}
      >
        <Input type="date" />
      </FormItem>
    </Form>
  );
};
