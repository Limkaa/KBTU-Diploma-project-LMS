import React from "react";

function SchoolCommunities() {
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
        <button
          style={{
            display: "flex",
            alignItems: "center",
            outline: "none",
            border: "none",
            backgroundColor: "transparent",
          }}
        >
          <p style={{ fontSize: 16, color: "#000000", fontWeight: 700 }}>1</p>
          <img
            style={{
              width: 38,
              height: 38,
              backgroundColor: "#D9D9D9",
              borderRadius: 8,
              marginLeft: 10,
            }}
          />
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
              }}
            >
              Info channel School 24
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
              }}
            >
              Informational channel for all the students of school...
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default SchoolCommunities;
