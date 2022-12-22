import AdventDay from "./adventDay";
import { useState, useEffect } from "react";

const Calendar = ({ data }) => {
  const [imagesData, setImagesData] = useState(null);

  useEffect(() => {
    fetch(
      "https://adventcalendar-legoushka.amvera.io/calendar/images/" + data.id
    )
      .then((res) => res.json())
      .then((imagesData) => {
        /* imagesData.calendarCells.map((day, index) => (day.index = index));
        imagesData.calendarCells.sort((a, b) => 0.5 - Math.random()); */
        setImagesData(imagesData);
      });
  }, []);

  return (
    <>
      <header className="container m-20 mx-auto flex flex-col items-center justify-center">
        <h2 className="block text-6xl">Advent of {data.title}</h2>
        <h4 className="mt-4 block text-2xl italic">
          from your friend
          <span> {data.author}</span>
        </h4>
      </header>
      <main className="mx-auto grid w-5/6 grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3">
        {imagesData ? (
          imagesData.calendarCells.map((day, index) => {
            return (
              <AdventDay startDay={data.startDate} day={day} key={index} />
            );
          })
        ) : (
          <div className="bg-red relative col-span-3 flex h-52 w-full items-center justify-center overflow-hidden rounded text-5xl italic">
            Loading
          </div>
        )}
      </main>
    </>
  );
};
export async function getServerSideProps(context) {
  const queryString = context.query.id;
  const res = await fetch(
    "https://adventcalendar-legoushka.amvera.io/calendar/data/" + queryString
  );
  const data = await res.json();
  const initData = {
    title: data.title,
    author: data.author,
    startDate: data.startDate,
    daysDyration: data.daysDyration,
    id: queryString,
  };
  return {
    props: { initData }, // will be passed to the page component as props
  };
}

export default Calendar;
