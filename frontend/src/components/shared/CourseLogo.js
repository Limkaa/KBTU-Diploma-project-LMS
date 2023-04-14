import React from "react";
import { colors } from "./Colors";

const CourseLogo = ({ title, width, height, fontSize }) => {
  const firstLetter = (str) => {
    var matches = str.match(/\b(\w)/g);
    var acronym = matches.join("");
    return acronym;
  };

  return (
    <div
      style={{
        ...styles.letter,
        width: width ? width : 120,
        height: height ? height : 120,
        fontSize: fontSize || 30,
        backgroundColor: colors[Math.floor(Math.random() * colors?.length)],
      }}
    >
      {firstLetter(title || "U")}
    </div>
  );
};
const styles = {
  letter: {
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 500,
    borderRadius: 10,
    color: "black",
  },
};
export default CourseLogo;
