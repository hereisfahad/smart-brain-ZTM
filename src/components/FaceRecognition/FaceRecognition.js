import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box, box1, box2 }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img id="inputimage" alt="" src={imageUrl} width="500px" heigh="auto" />
        <div
          className="bounding-box"
          style={{
            top: box.topRow,
            right: box.rightCol,
            bottom: box.bottomRow,
            left: box.leftCol
          }}
        ></div>
        {/* <div className="bounding-box" style={{top: box1.topRow, right: box1.rightCol, bottom: box1.bottomRow, left: box1.leftCol}}></div> */}
        {/* <div className="bounding-box" style={{top: box2.topRow, right: box2.rightCol, bottom: box2.bottomRow, left: box2.leftCol}}></div> */}
      </div>
    </div>
  );
};

export default FaceRecognition;
