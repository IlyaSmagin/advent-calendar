import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [newCalendarUrl, setNewCalendarUrl] = useState(null);
  const [adventImages, setadventImages] = useState([]);
  const [send, setSend] = useState(false);
  const [adventEncodedImages, setAdventEncodedImages] = useState([]);

  const oneDay = 1000 * 60 * 60 * 24;
  const [formData, setFormData] = useState({
    title: "Memorable moments",
    author: "Secret Santa",
    startDate: Math.floor(Date.now() / oneDay) - 1,
    daysDuration: 0,
    calendarCells: [],
  });
  function handleUpdate(e, indexToChange) {
    const replaceImg = adventImages.map((image, index) => {
      if (indexToChange === index) {
        encodeImageFileAsURL(e.target.files[0], indexToChange);
        return e.target.files[0];
      } else {
        // The rest haven't changed
        return image;
      }
    });
    setadventImages(replaceImg);
  }
  function handleAdd(e) {
    const lengthOfArray = adventImages.length;
    for (let juk = 0; juk < e.target.files.length; juk++) {
      const imageToAdd = e.target.files[juk];
      encodeImageFileAsURL(imageToAdd, lengthOfArray + juk);
      setadventImages((list) => [...list, imageToAdd]);
    }
  }

  const handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;
    if (name === "startDate") {
      value = Math.floor(new Date(value) / oneDay) - 1;
    }
    setFormData((values) => ({ ...values, [name]: value }));
  };

  function encodeImageFileAsURL(image, index) {
    let reader = new FileReader();
    reader.onloadend = function () {
      const base64String =
        reader.result.replace("data:", "").replace(/^.+,/, "") || ""; //undefined?
      setAdventEncodedImages((prevEncoded) => {
        let newprev = [...prevEncoded];
        newprev[index] = base64String;
        return newprev;
      });
    };
    reader.readAsDataURL(image);
  }
  useEffect(() => {
    setFormData((values) => ({
      ...values,
      calendarCells: adventEncodedImages.map((image, index) => ({
        number: index,
        header: "",
        text: "",
        imageB64: image,
      })),
      daysDuration: adventEncodedImages.length,
    }));
  }, [adventEncodedImages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSend(true);
    console.log(
      /*


      Math.floor(Date.now() / oneDay),
      adventImages.length,
      adventImages,
      adventEncodedImages*/
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
        setSend(false);
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
      <header className="container m-20 mx-auto flex flex-col items-center justify-center text-center">
        <h2 className="block text-4xl font-semibold md:text-6xl">
          Create custom advent calendar
        </h2>
        <h4 className="mt-2 block text-2xl italic md:mt-4 md:text-4xl">
          for your friends
        </h4>
      </header>
      <main className="container mx-auto flex flex-col items-center justify-center">
        <form
          className="mx-auto flex w-full flex-col items-center px-4"
          onSubmit={handleSubmit}
        >
          <div className="mb-6 w-full max-w-sm md:flex md:max-w-lg md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-3xl md:mb-0 md:text-right"
                htmlFor="adventTitle"
              >
                Title:
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none border-b-2 border-black bg-[#f5f1e9] py-2 px-4 leading-tight focus:border-[#327d85] focus:outline-none"
                id="adventTitle"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-6 w-full max-w-sm md:flex md:max-w-lg md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-3xl md:mb-0 md:text-right"
                htmlFor="adventAuthor"
              >
                Your name:
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none border-b-2 border-black bg-[#f5f1e9] py-2 px-4 leading-tight focus:border-[#327d85] focus:outline-none"
                id="adventAuthor"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-6 w-full max-w-sm md:flex md:max-w-lg md:items-center">
            <div className="md:w-1/3">
              <label
                className="mb-1 block pr-4 text-3xl md:mb-0 md:text-right"
                htmlFor="adventStartDate"
              >
                Starts from:
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none border-b-2 border-black bg-[#f5f1e9] py-2 px-4 leading-tight focus:border-[#327d85] focus:outline-none"
                id="adventStartDate"
                type="date"
                name="startDate"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mx-auto mt-20 flex w-5/6 flex-wrap items-center justify-center gap-4">
            {adventImages.map((img, index) => {
              return (
                <div
                  className="bg-slate relative aspect-square w-full  max-w-sm overflow-hidden rounded md:w-52"
                  key={index}
                >
                  <img
                    className="h-full w-full bg-cover bg-center"
                    src={URL.createObjectURL(img)}
                  />
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
            <div className="bg-slate aspect-square w-full max-w-sm overflow-hidden rounded md:w-52">
              <label
                htmlFor="fileadd"
                className="relative flex h-full w-full cursor-pointer items-center justify-center text-center"
              >
                <input
                  type="file"
                  id="fileadd"
                  onChange={handleAdd}
                  className="absolute inset-0 z-10 opacity-0"
                  multiple={true}
                />
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
          <div className="mb-6 mt-20 flex items-center">
            <button
              className="bg-green mx-auto flex-shrink-0 rounded py-3 px-6 text-white"
              type="submit"
            >
              {!send ? "Create calendar" : "Creating your calendar"}
            </button>
          </div>
        </form>
        <div>
          {newCalendarUrl ? (
            <Link
              className="bg-red mx-auto flex-shrink-0 rounded py-3 px-6 text-white"
              href={"/calendar/" + newCalendarUrl}
            >
              Your calendar
            </Link>
          ) : (
            <Link
              className="bg-slate mx-auto flex-shrink-0 rounded py-3 px-6 text-black"
              href="/calendar/errors-by-Lalacode-ab1ce556-3432-4806-b625-8ce6eeb2dd8c"
            >
              TEST CALENDAR
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
