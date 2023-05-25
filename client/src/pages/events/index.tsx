import Link from "next/link";

const EventsPage: React.FC = () => {
  return (
    <div className="w-full max-h-screen">
      <div className="flex justify-start">
        <Link
          href="/events/create-event"
          className="px-4 py-1 text-white rounded-full bg-primary hover:bg-hoverPrimary"
        >
          Create Event
        </Link>
      </div>
      <div className="pt-5">
        <div className="text-3xl ">No Events yet.</div>
      </div>
    </div>
  );
};
export default EventsPage;
