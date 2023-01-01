import AdventDay from "./adventDay";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Calendar = ({ data }) => {
  const [imagesData, setImagesData] = useState({
    calendarCells: Array.apply(null, Array(data.daysDuration)).map(function (
      x,
      i
    ) {
      return { number: i + 1, header: "", text: `$(i)`, imageB64: "s" };
    }),
  });

  useEffect(() => {
    fetch(
      "https://adventcalendar-legoushka.amvera.io/calendar/images/" + data.id
    )
      .then((res) => res.json())
      .then((imagesData) => {
        imagesData.calendarCells.sort(() => Math.random() - 0.5);
        setImagesData(imagesData);
      });
  }, []);

  return (
    <>
      <header className="container m-20 mx-auto flex flex-col items-center justify-center px-8 text-center">
        <h2 className="block text-6xl">Advent of {data?.title}</h2>
        <h4 className="mt-4 block text-2xl italic">
          from your friend
          <span> {data?.author}</span>
        </h4>
      </header>
      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto mb-12 grid w-5/6 grid-flow-dense grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 "
      >
        {imagesData ? (
          imagesData.calendarCells.map((day, index) => {
            return (
              <AdventDay startDay={data.startDate} day={day} key={index} />
            );
          })
        ) : (
          <div className="bg-red relative col-span-12 flex h-52 w-full items-center justify-center overflow-hidden rounded text-5xl italic">
            Loading
          </div>
        )}
      </motion.main>
    </>
  );
};
export async function getServerSideProps(context) {
  const queryString = context.query.id;
  const res = await fetch(
    "https://adventcalendar-legoushka.amvera.io/calendar/data/" + queryString
  );
  const jsonData = await res.json();
  const data = {
    title: jsonData.title,
    author: jsonData.author,
    startDate: jsonData.startDate,
    daysDuration: jsonData.daysDuration,
    id: queryString,
  };
  return {
    props: { data }, // will be passed to the page component as props
  };
}

export default Calendar;
