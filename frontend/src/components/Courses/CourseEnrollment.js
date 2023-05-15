import { Radio, Select } from "antd";
import React from "react";
import {
  useCreateEnrollmentMutation,
  useGetCourseEnrollmentsQuery,
  useGetNotEnrolledStudentsQuery,
  useGetStudentsWithTransferredEnrollmentsQuery,
  useUpdateEnrollmentMutation,
} from "../../redux/enrollments/enrollmentsApiSlice";
import { useParams } from "react-router-dom";
import { Table, Input, Button, Space, Tag, Spin } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import styled from "styled-components";
import { toastify } from "../shared/Toast/Toast";
import PlusSvg from "../../assets/icons/PlusIcon";

const SelectStyled = styled(Select)`
  &.ant-select-single .ant-select-selector {
    color: rgba(74, 77, 88, 1);
    font-family: "Open Sans";
    font-weight: 700;
    font-size: 14px;
    height: 40px;
    align-items: center;
  }
`;

const CourseEnrollment = () => {
  const { id: course_id } = useParams();
  const [select, setSelect] = React.useState("course");
  const [enrollments, setEnrollments] = React.useState();
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();
  const [search, setSearch] = React.useState("");
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [selectedTransferred, setSelectedTransferred] = React.useState([]);

  const {
    data: dataCourse,
    isLoading: isLoadingCourse,
    refetch,
  } = useGetCourseEnrollmentsQuery({ course_id, page, search });

  const {
    data: dataTransferred,
    isLoading: isLoadingTransferred,
    refetch: refetchTransferred,
  } = useGetStudentsWithTransferredEnrollmentsQuery({
    course_id,
    page,
    search,
  });

  const {
    data: dataNotEnrolled,
    isLoading: isLoadingNotEnrolled,
    refetch: refetchNotEnrolled,
  } = useGetNotEnrolledStudentsQuery({ course_id, page, search });

  const [createEnrollment] = useCreateEnrollmentMutation();
  const [updateEnrollment] = useUpdateEnrollmentMutation();

  React.useEffect(() => {
    if (select === "course") {
      if (dataCourse && !isLoadingCourse) {
        if (page === 1) setTotal(dataCourse.count);
        setEnrollments(dataCourse.results);
      }
    } else if (select === "notEnrolled") {
      if (dataNotEnrolled && !isLoadingNotEnrolled) {
        if (page === 1) setTotal(dataNotEnrolled.count);
        setEnrollments(dataNotEnrolled.results);
      }
    } else if (select === "transferred") {
      if (dataTransferred && !isLoadingTransferred) {
        if (page === 1) setTotal(dataTransferred.count);
        setEnrollments(dataTransferred.results);
      }
    }
  }, [
    dataCourse,
    isLoadingCourse,
    dataTransferred,
    isLoadingTransferred,
    dataNotEnrolled,
    isLoadingNotEnrolled,
    select,
  ]);

  const handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
    if (select === "notEnrolled") setSelectedRows(selectedRows);
    else if (select === "transferred") setSelectedTransferred(selectedRows);
  };

  const rowSelection = {
    selectedRows,
    onChange: handleRowSelectionChange,
  };

  const handleCreateEnrollment = async () => {
    for (let row of selectedRows) {
      try {
        await createEnrollment({
          course_id: course_id,
          student: row?.id,
        }).then(() => {
          refetch();
          refetchNotEnrolled();
          toastify("success", "Enrollments Created");
          setSelectedRows([]);
        });
      } catch (err) {
        toastify(
          "error",
          `Failed to create enrollment for ${row.user.first_name} ${row.user.last_name}`
        );
      }
    }
  };

  const handleUpdateEnrollment = async () => {
    for (let row of selectedTransferred) {
      try {
        await updateEnrollment({
          course_id: course_id,
          enrollment_id: row?.id,
        }).then(() => {
          refetch();
          refetchTransferred();
          toastify("success", "Enrollments Updated");
          setSelectedTransferred([]);
        });
      } catch (err) {
        toastify(
          "error",
          `Failed to update enrollment for ${row.user.first_name} ${row.user.last_name}`
        );
      }
    }
  };

  const columns = [
    {
      title: () => {
        return <>Student</>;
      },
      width: "30%",
      render: (item) => (
        <>
          <div
            style={{
              textDecoration: "none",
              fontWeight: 500,
              color: "#00889D",
            }}
          >
            {select === "notEnrolled"
              ? item?.user?.last_name + " " + item?.user?.first_name
              : item?.student?.user?.last_name +
                " " +
                item?.student?.user?.first_name}
          </div>
          <div>
            {select === "notEnrolled"
              ? item?.user?.email
              : item?.student?.user?.email}
          </div>
        </>
      ),
    },
    {
      title: () => {
        return <>Group</>;
      },
      width: "30%",
      render: (item) => (
        <div>
          {select === "notEnrolled"
            ? item?.group?.grade?.name
            : item?.student?.group?.grade?.name}
        </div>
      ),
    },
    {
      title: "Gender",
      key: "gender",
      width: "20%",
      render: (item) => (
        <Tag
          style={{ minWidth: 50, textAlign: "center" }}
          color={
            select === "notEnrolled"
              ? item?.user?.gender === "male"
                ? "blue"
                : "pink"
              : item?.student?.user?.gender === "male"
              ? "blue"
              : "pink"
          }
        >
          {select === "notEnrolled"
            ? item?.user?.gender
            : item?.student?.user?.gender}
        </Tag>
      ),
    },
    {
      title: "Group",
      key: "group",
      width: "15%",
      render: (item) => {
        return (
          <Tag style={{ minWidth: 53, textAlign: "center" }}>
            {select === "notEnrolled"
              ? item?.group?.code
              : item?.student?.group?.code}
          </Tag>
        );
      },
    },
  ];

  return (
    <div>
      <div style={styles.tableCont}>
        <div style={styles.filter}>
          <SelectStyled
            size={"middle"}
            style={{ width: 240 }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            options={[
              { value: "course", label: "Course Enrollments" },
              { value: "notEnrolled", label: "Not enrolled students" },
              { value: "transferred", label: "Transferred students" },
            ]}
            onChange={(val) => setSelect(val)}
            defaultValue={"course"}
            value={select}
          />
          <div style={{ display: "flex" }}>
            <Input
              size="default size"
              placeholder="Search..."
              prefix={<img src={Search} style={{ height: 15, width: 15 }} />}
              style={styles.search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
            {select === "notEnrolled" && (
              <Button
                type="primary"
                style={{
                  ...styles.btnAdd,
                  backgroundColor:
                    selectedRows?.length === 0
                      ? "rgba(248, 249, 250, 1)"
                      : "#163A61",
                }}
                icon={
                  <PlusSvg
                    color={
                      selectedRows?.length === 0
                        ? "rgba(186, 187, 187, 1)"
                        : "white"
                    }
                  />
                }
                onClick={() => handleCreateEnrollment()}
                disabled={selectedRows?.length === 0}
              >
                Enroll students
              </Button>
            )}
            {select === "transferred" && (
              <Button
                type="primary"
                style={{
                  ...styles.btnAdd,
                  backgroundColor:
                    selectedTransferred?.length === 0
                      ? "rgba(248, 249, 250, 1)"
                      : "#163A61",
                }}
                icon={
                  <PlusSvg
                    color={
                      selectedTransferred?.length === 0
                        ? "rgba(186, 187, 187, 1)"
                        : "white"
                    }
                  />
                }
                onClick={() => handleUpdateEnrollment()}
                disabled={selectedTransferred?.length === 0}
              >
                Enroll students
              </Button>
            )}
          </div>
        </div>
        <Spin spinning={isLoadingCourse} size="large">
          <Table
            dataSource={enrollments}
            columns={columns}
            rowKey={(item) => item?.id}
            pagination={{
              total: total,
              current: page,
              onChange: (page) => {
                setPage(page);
              },
              showSizeChanger: false,
            }}
            rowSelection={select === "course" ? false : rowSelection}
          />
        </Spin>
      </div>
    </div>
  );
};

const styles = {
  tableCont: {
    marginTop: 15,
    borderRadius: 8,
    border: "1px solid #0000000D",
  },
  search: {
    height: 40,
    width: 280,
    //   border: "none",
    //   borderRadius: 8,
  },
  filter: {
    padding: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnAdd: {
    backgroundColor: "#163A61",
    borderRadius: 8,
    alignItems: "center",
    display: "flex",
    height: 40,
    fontWeight: 500,
    marginLeft: 16,
    gap: 5,
  },
};

export default CourseEnrollment;
