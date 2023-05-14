import { Modal, Select, Input } from "antd";
import React from "react";

const AwardCourseStudent = ({
  setShow,
  show,
  studentsOptions,
  studentId,
  setStudentId,
  awardId,
  setAwardId,
  awardsOptions,
  comment,
  setComment,
  handle,
}) => {
  return (
    <Modal
      title="Award Student"
      style={{ fontSize: 25 }}
      open={show}
      onOk={() => handle()}
      onCancel={() => setShow(false)}
      maskClosable={false}
      okText={"Award"}
    >
      <div style={{ marginTop: 20 }}>
        <div style={styles.select}>
          <div style={styles.title}>Student:</div>
          <Select
            size={"middle"}
            style={{ width: "100%" }}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            onChange={(val) => setStudentId(val)}
            options={studentsOptions}
            defaultValue={studentsOptions[0]}
            value={studentId}
          />
        </div>
        <div style={styles.select}>
          <div style={styles.title}>Award:</div>
          <Select
            size={"middle"}
            style={{ width: "100%" }}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            onChange={(val) => setAwardId(val)}
            options={awardsOptions}
            defaultValue={awardsOptions[0]}
            value={awardId}
          />
        </div>
        <div style={styles.select}>
          <div style={styles.title}>Comment:</div>
          <Input.TextArea
            placeholder="Comment..."
            autoSize
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

const styles = {
  select: {
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 7,
    color: "#4A4D58",
  },
};
export default AwardCourseStudent;
