import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';

const App = () => {
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const sliderRef = useRef();

  const updateNotes = (date, note) => {
    setNotes({ ...notes, [date]: { "eur/usd": note } });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const renderCalendar = () => {
    const calendarGrid = [];
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const noteObj = notes[format(date, 'yyyy-MM-dd')];
      const note = noteObj ? noteObj["eur/usd"] : null;

      calendarGrid.push(
        <div
          key={i}
          className={`date-box ${selectedDate && selectedDate.getTime() === date.getTime() ? 'selected' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          <div className="date">{i}</div>
          {note && <div className="note">{note}</div>}
        </div>
      );
    }

    const monthName = format(currentMonth, 'MMMM yyyy');

    return (
      <div>
        <h2>{monthName}</h2>
        <div className="calendar">
          {calendarGrid}
        </div>
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: false, // Disable infinite scrolling
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const nextMonth = () => {
    sliderRef.current.slickNext();
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    sliderRef.current.slickPrev();
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div>
      <h1>Calendar with Notes</h1>
      <button onClick={prevMonth}>Previous Month</button>
      <button onClick={nextMonth}>Next Month</button>
      <Slider {...settings} ref={sliderRef}>
        {renderCalendar()}
      </Slider>
      <div className="note-editor">
        <h3>Add/Update Note</h3>
        {selectedDate && (
          <>
            <div>Date: {format(selectedDate, 'yyyy-MM-dd')}</div>
            <input
              type="text"
              placeholder="Enter a note..."
              value={notes[format(selectedDate, 'yyyy-MM-dd')] ? notes[format(selectedDate, 'yyyy-MM-dd')]["eur/usd"] || '' : ''}
              onChange={(e) => updateNotes(format(selectedDate, 'yyyy-MM-dd'), e.target.value)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
