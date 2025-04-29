
export default function Home() {
  return (
    <>
    <div className="flex flex-col items-center justify-center overflow-hidden">
      <h1 className="py-3.5 px-0.5 z-5 text-transparent  bg-white text-edge-outline font-display sm:text-sm md:text-5xl whitespace-nowrap bg-clip-text ">
        Welcome to this app!
      </h1>
      <div className="my-16 text-center">
        <h2 className="text-md text-zinc-500 ">
          This is a simple application that allows you to create and view lists.
          <br />
          For the moment only shopping and series lists are available.
        </h2>
      </div>
    </div>
    </>
  );
}
