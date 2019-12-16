import React from 'react'
import DatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css";

function MyDatePicker({currentDate, setCurrentDate, ...props}) {

  return (
    <div>
      <h1>{props.title}</h1>
      <DatePicker
        selected={currentDate}
        onChange={(date) => setCurrentDate(date)}
      />
    </div>
  )
}

export default MyDatePicker
