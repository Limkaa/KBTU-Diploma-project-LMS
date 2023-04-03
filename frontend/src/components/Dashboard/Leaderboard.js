import React from "react";

const Leaderboard = () => {
  return (
    <div style={styles.container}>
      <p className="ann-title">Leader Board</p>
      <div>
        <div style={styles.selfCont}>
          <p style={{ fontSize: 12, color: "#828282", fontWeight: 600 }}>
            Your position
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: 12, color: "#000000", fontWeight: 600 }}>
              30
            </p>
            <div
              style={{
                display: "flex",
                marginLeft: 12,
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img className="ann-img" />
                <p
                  style={{
                    marginLeft: 8,
                    fontSize: 12,
                    color: "#000000",
                    fontWeight: 600,
                  }}
                >
                  Ayazhan Utemurat
                </p>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "#000000",
                  fontWeight: 600,
                }}
              >
                100
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "white",
    padding: 16,
    paddingTop: 0,
    borderRadius: 8,
    flex: 1,
  },
  selfCont: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingTop: 1,
    paddingRight: 12,
    paddingLeft: 12,
    paddingBottom: 6,
  },
};

export default Leaderboard;
