import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  "use cache";
  cacheLife("hours");

  // Validate BASE_URL is present and non-empty
  if (!BASE_URL || BASE_URL.trim() === "") {
    console.error("BASE_URL environment variable is missing or empty");
    return (
      <section>
        <h1 className="text-center">
          The Hub for Every Dev <br /> Event You Can&apos;t Miss
        </h1>
        <p className="text-center mt-5">
          Hackathons, Meetups, and Conferences, All in One Place
        </p>
        <ExploreBtn />
        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>
          <p className="text-red-500">
            Unable to load events. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  let events: IEvent[] = [];
  let error: string | null = null;

  try {
    const url = `${BASE_URL}/api/events`;
    const response = await fetch(url);

    // Check if response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch events: ${response.status} ${response.statusText} from ${url}`
      );
    }

    // Parse JSON response
    const data = await response.json();
    events = data.events || [];
  } catch (err) {
    console.error("Error fetching events:", err);
    error =
      err instanceof Error ? err.message : "Failed to load events from server";
  }

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="events">
            {events &&
              events.length > 0 &&
              events.map((event: IEvent) => (
                <li key={event.title} className="list-none">
                  <EventCard {...event} />
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Page;
