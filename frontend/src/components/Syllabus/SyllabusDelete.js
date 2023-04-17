import { Modal } from "antd";
import React from "react";

const SyllabusDelete = ({
  showDeleteSyllabus,
  setShowDeleteSyllabus,
  handleDeleteSyllabus,
}) => {
  return (
    <Modal
      title="Are you sure about deleting this syllabus point?"
      open={showDeleteSyllabus}
      onOk={handleDeleteSyllabus}
      onCancel={() => setShowDeleteSyllabus(false)}
    >
      <p>Data cannot be recovered</p>
    </Modal>
  );
};

export default SyllabusDelete;
