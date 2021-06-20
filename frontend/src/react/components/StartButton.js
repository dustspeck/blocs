import React from "react";
import { Link } from "react-router-dom";

import styles from "../styles/Game.module.css";
const StartButton = () => {
  return (
    <Link to="/game" className={styles.enterGameButton}>Enter Space</Link>
  );
};

export default StartButton;
