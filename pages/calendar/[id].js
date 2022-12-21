import { useRouter } from "next/router";
import AdventDay from "./adventDay";
import { useState, useEffect } from "react";

const Calendar = ({ initData }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(
      "https://adventcalendar-legoushka.amvera.io/calendar/Latest-by-lalacode-e36c7975-b65a-4044-a29e-ca147c4cb455"
    )
      .then((res) => res.json())
      .then((data) => {
        data.calendarCells.map((day, index) => (day.index = index));
        data.calendarCells.sort((a, b) => 0.5 - Math.random());
        setData(data);
      });
  }, []);

  return (
    <>
      <header className="container m-20 mx-auto flex flex-col items-center justify-center">
        <h2 className="block text-6xl">
          Advent of {data ? data.title : initData.title}
        </h2>
        <h4 className="mt-4 block text-2xl italic">
          from your friend
          <span> {data ? data.author : initData.author}</span>
        </h4>
      </header>
      <main className="mx-auto grid w-5/6 grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data ? (
          data.calendarCells.map((day, index) => {
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
  const indexOfDivider = queryString.indexOf("-by-");
  const queryTitle = queryString.slice(0, indexOfDivider);
  const queryAuthor = queryString.slice(
    indexOfDivider + 4,
    queryString.indexOf("-", indexOfDivider + 4)
  );
  return {
    props: { initData: { title: queryTitle, author: queryAuthor } }, // will be passed to the page component as props
  };
}

export default Calendar;
