import MapComponent from "./mapComponent";

export default function HeroSection() {
  return (
    <>
      <main className="flex h-fit w-full flex-col p-2 md:flex-row">
        <div className="flex min-h-[50vh] flex-col justify-center gap-4 bg-card text-center md:w-1/2">
          <h1 className="text-4xl font-bold">Goofy Goofers</h1>
          <div className="mx-8 text-xl font-normal">
            <h2>Get to know the disasters around you.</h2>
            <h2>Help people in need through chat.</h2>
          </div>
        </div>
        {/* <Map classNameName="h-screen w-full shadow-md" /> */}
        <MapComponent className="animate-scale h-[calc(100vh-5rem)] w-full overflow-hidden rounded-md border-2 border-border" />
      </main>
    </>
  );
}
