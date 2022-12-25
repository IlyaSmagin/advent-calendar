import { useState } from "react";
const AdventDay = ({ day, startDay }) => {
  const [isOpened, setIsOpened] = useState(false);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayIs = new Date(startDay * oneDay).getDate();
  const todayIs = Math.round(Date.now() / oneDay);
  const handleClick = (e) => {
    e.preventDefault;
    if (todayIs > Number(day.number) + Number(startDay)) {
      setIsOpened((prev) => !prev);
    }
  };
  return (
    <>
      {day ? (
        <div
          className={
            `md:full group relative h-full w-full overflow-hidden rounded sm:min-h-[13rem] sm:min-w-[13rem] ` +
            (day.number % 8 === 0
              ? "sm:row-span-2"
              : day.number % 7 === 0
              ? "sm:col-span-2"
              : "aspect-square")
          }
          onClick={handleClick}
        >
          <div
            className="absolute h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('data:image/jpeg;base64, " + day.imageB64 + "')",
            }}
          >
            {day?.text ? (
              <p className=" absolute inset-x-4 bottom-4 rounded bg-slate-100/80 p-4 text-lg font-bold">
                {day.text}
                {/* TODO DO NOT SHOW OF NO TEXXT */}
              </p>
            ) : (
              <p className="absolute top-4 right-4 rounded bg-slate-100/80 p-4 text-lg font-bold opacity-0 transition-opacity group-hover:opacity-100">
                {dayIs + day.number - 1}
              </p>
            )}
          </div>
          <div
            className={
              "relative z-10 flex h-full w-full items-center justify-center transition-opacity duration-500 " +
              (day.number % 2 === 0
                ? "bg-red"
                : day.number % 3 === 0
                ? "bg-green"
                : "bg-slate") +
              (isOpened === false ? " opacity-100" : " opacity-0")
            }
          >
            <h2 className="text-6xl font-semibold">{dayIs + day.number - 1}</h2>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};
export default AdventDay;
