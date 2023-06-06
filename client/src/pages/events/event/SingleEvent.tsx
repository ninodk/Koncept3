import { useRouter } from "next/router";
import { testEvents } from "../../../utility/data/testData";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

interface EventProps {
  id: string;
}
const SingleEvent: React.FC<EventProps> = ({ id }: { id: string }) => {
  const events = testEvents.filter((item) => item.id === Number(id));
  const event = events[0];

  return (
    <div className="w-full align-center max-w-screen">
      {event && (
        <div>
          <Head>
            <title>{event.title}</title>
          </Head>
          <div className="flex flex-col">
            <div className="w-full max-w-full">
              <div className="flex flex-row gap-2">
                <div className="relative mt-5 mb-5 mr-5 overflow-hidden max-w-1/2 w-max">
                  <Image
                    src={event.image}
                    className="border-2 border-purple-600 border-solid rounded-lg"
                    width={512}
                    height={512}
                    alt="event Image"
                  ></Image>
                </div>
                <div className="flex flex-col w-1/2 mt-5 mb-5 mr-5 overflow-hidden gap-y-3 max-w-1/2">
                  <div className="flex flex-row justify-between">
                    <div className="text-3xl font-semibold text-slate-800">
                      {event.title}
                    </div>
                    <div className="flex">
                      <button className="px-4 py-1 text-white rounded-full bg-primary hover:bg-slate-900">
                        Enter
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <p className="text-slate-900">
                      <span>Hosted by </span>
                    </p>
                  </div>
                  <div className="flex gap-x-8">
                    <div className="">
                      <p className="text-xs tracking-wider uppercase text-slate-900">
                        <span>Start Date</span>
                      </p>
                      <p className="mt-1 text-xl font-medium tracking-wide uppercase text-primary">
                        <span>{event.startDate}</span>
                      </p>
                    </div>
                    <div className="">
                      <p className="text-xs tracking-wider uppercase text-slate-900">
                        <span>End Date</span>
                      </p>
                      <p className="mt-1 text-xl font-medium tracking-wide uppercase text-primary">
                        <span>{event.endDate}</span>
                      </p>
                    </div>
                    <div className="">
                      <p className="text-xs tracking-wider uppercase text-slate-900">
                        <span>Location</span>
                      </p>
                      <p className="mt-1 text-xl font-medium tracking-wide uppercase text-primary">
                        <span>NY City, New York</span>
                      </p>
                    </div>
                    <div className="">
                      <p className="text-xs tracking-wider uppercase text-slate-900">
                        <span>Requirements</span>
                      </p>
                      <p className="mt-2 rounded-lg text-sm font-medium tracking-wide uppercase text-white bg-purple-600 px-2 py-0.5">
                        <span>Holders only</span>
                      </p>
                    </div>
                  </div>
                  <div className="h-max">
                    <p className="text-xs tracking-wider uppercase text-slate-900">
                      <span>Description</span>
                    </p>
                    <p className="text-slate-900">
                      <span>{event.description}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SingleEvent;
