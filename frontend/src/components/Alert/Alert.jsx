import React, {useEffect, useRef} from 'react';
import './Alert.css';

const Alert = (props) => {
    const alert = React.useRef(null);
    // let visible = true;
    useEffect(() => {
        alert.current.style.right = "20px";
        setTimeout(() => {
            alert.current.style.right = "-220px";
        }, 2000);
    })
    return (
        <div className="alert" ref={alert}>
            <p>{props.message}</p>
        </div>
    );
};

export default Alert;