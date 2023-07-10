
import React, { useEffect, useState } from "react";
import Weather from "./components/Weather";
import classes from './App.module.css'

function App() {
  return (
    <React.Fragment>
      <div className={classes.container}>
        <Weather />
      </div>
    </React.Fragment>
  );
}

export default App;
