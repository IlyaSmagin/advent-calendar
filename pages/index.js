import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [newCalendarUrl, setNewCalendarUrl] = useState(null);
  const [adventImages, setadventImages] = useState([]);
  const [adventEncodedImages, setAdventEncodedImages] = useState([]);
  const [inputs, setInputs] = useState({
    adventTitle: "Memorable moments",
    adventAuthor: "Secret Santa",
  });
  const [formData, setFormData] = useState({
    title: "Memorable moments",
    author: "Secret Santa",
    startDate: 1,
    daysDuration: 0,
    calendarCells: [],
  });
  function handleUpdate(e, indexToChange) {
    const replaceImg = adventImages.map((image, index) => {
      if (indexToChange === index) {
        encodeImageFileAsURL(e.target.files[0], index);
        return URL.createObjectURL(e.target.files[0]);
      } else {
        // The rest haven't changed
        return image;
      }
    });
    setadventImages(replaceImg);
  }
  function handleAdd(e) {
    encodeImageFileAsURL(e.target.files[0], adventImages.length);
    setadventImages((list) => [...list, e.target.files[0]]);
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  function encodeImageFileAsURL(image, index) {
    let reader = new FileReader();
    reader.onloadend = function () {
      const base64String = reader.result
        .replace("data:", "")
        .replace(/^.+,/, "");
      setAdventEncodedImages((encodedArray) => [
        ...encodedArray,
        (encodedArray.index = base64String),
      ]);
      console.log("encoded", index);
    };
    reader.readAsDataURL(image);
  }
  useEffect(() => {
    let tmpCalCells = adventEncodedImages.map((image, index) => {
      return {
        number: index,
        header: "",
        text: "",
        imageB64: image,
      };
    });
    setFormData((values) => ({
      ...values,
      calendarCells: tmpCalCells,
      daysDuration: tmpCalCells.length,
    }));

    console.log("added ");
  }, [adventEncodedImages]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const oneDay = 1000 * 60 * 60 * 24;
    setFormData((values) => ({ ...values, author: inputs.adventAuthor }));
    setFormData((values) => ({ ...values, title: inputs.adventTitle }));
    setFormData((values) => ({
      ...values,
      startDate: Math.floor(Date.now() / oneDay) - 1,
    }));
    console.log(
      /*
      inputs,
      Math.floor(Date.now() / oneDay),
      adventImages.length,
      adventImages,
      adventEncodedImages */
      formData
    );
    fetch("https://adventcalendar-legoushka.amvera.io/create", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((res) => {
        /*
          setMessage("We'll be in touch soon.");
          setStatus("success"); */
        setNewCalendarUrl(res.generatedId);
        console.log(res);
      })
      .catch((err) => {
        console.log(err.toString());
        /* setStatus("error"); */
      });
  };
  return (
    <>
      <Head>
        <title>Advent</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="container m-20 mx-auto flex flex-col items-center justify-center">
        <h2 className="block text-6xl">Create custom advent calendar</h2>
        <h4 className="mt-4 block text-4xl italic">for your friends</h4>
      </header>
      <main className="container mx-auto flex flex-col items-center justify-center">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-3xl font-bold md:mb-0  md:text-right"
                htmlFor="adventTitle"
              >
                Title:
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full max-w-sm appearance-none border-b-2 border-black bg-[#f5f1e9] py-2 px-4 leading-tight focus:border-[#327d85] focus:outline-none"
                id="adventTitle"
                type="text"
                name="adventTitle"
                value={inputs.adventTitle || "Memorable moments"}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-3xl font-bold md:mb-0 md:text-right"
                htmlFor="adventAuthor"
              >
                Your name:
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full max-w-sm appearance-none border-b-2 border-black bg-[#f5f1e9] py-2 px-4 leading-tight focus:border-[#327d85] focus:outline-none"
                id="adventAuthor"
                type="text"
                name="adventAuthor"
                value={inputs.adventAuthor || "Secret Santa"}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mx-auto mt-20 grid w-5/6 grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3">
            {adventImages.map((img, index) => {
              return (
                <div
                  className="bg-slate relative aspect-square w-full overflow-hidden rounded md:w-52"
                  key={index}
                >
                  <img src={URL.createObjectURL(adventImages[index])} />
                  <input
                    type="file"
                    id={`filechange${index}`}
                    onChange={(e) => handleUpdate(e, index)}
                    className="hidden"
                  />
                  <label
                    htmlFor={`filechange${index}`}
                    className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center text-center opacity-0 transition-opacity hover:bg-rose-400/60 hover:opacity-100"
                  >
                    <span className="inline-flex rounded border border-white py-2 px-7 text-base font-medium text-white">
                      Change
                    </span>
                  </label>
                </div>
              );
            })}
            <div className="bg-slate aspect-square w-full overflow-hidden rounded md:w-52">
              <input
                type="file"
                id="fileadd"
                onChange={handleAdd}
                className="hidden"
              />
              <label
                htmlFor="fileadd"
                className="flex h-full w-full cursor-pointer items-center justify-center text-center"
              >
                <div>
                  <span className="mb-2 block text-xl font-semibold ">
                    Drop files here
                  </span>
                  <span className="mb-2 block text-base font-medium">Or</span>
                  <span className="inline-flex rounded border border-black py-2 px-7 text-base font-medium">
                    Browse
                  </span>
                </div>
              </label>
            </div>
          </div>
          <div className="mb-6 mt-20 md:flex md:items-center">
            <button
              className="bg-green mx-auto flex-shrink-0  rounded py-3 px-6 text-white"
              type="submit"
            >
              Create calendar
            </button>
          </div>
        </form>
        <div>
          {newCalendarUrl ? (
            <Link href={"/calendar/" + newCalendarUrl}>Your calendar</Link>
          ) : (
            <Link href="/calendar/errors-by-Lalacode-ab1ce556-3432-4806-b625-8ce6eeb2dd8c">
              TEST CALENDAR
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
