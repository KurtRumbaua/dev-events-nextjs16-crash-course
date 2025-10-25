export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "React Summit US 2025",
    slug: "react-summit-us-2025",
    location: "San Francisco, CA, USA",
    date: "2025-11-07",
    time: "09:00 AM",
  },
  {
    image: "/images/event2.png",
    title: "Next.js Conf 2025",
    slug: "next-js-conf-2025",
    location: "San Francisco, USA",
    date: "2025-05-15",
    time: "10:00 AM",
  },
  {
    image: "/images/event3.png",
    title: "Web Summit 2025",
    slug: "web-summit-2025",
    location: "Lisbon, Portugal",
    date: "2025-11-03",
    time: "08:30 AM",
  },
  {
    image: "/images/event4.png",
    title: "TechCrunch Disrupt 2025",
    slug: "tech-crunch-disrupt-2025",
    location: "San Francisco, USA",
    date: "2025-09-22",
    time: "09:00 AM",
  },
  {
    image: "/images/event5.png",
    title: "JS Nation 2025",
    slug: "js-nation-2025",
    location: "Online",
    date: "2025-06-19",
    time: "11:00 AM",
  },
  {
    image: "/images/event6.png",
    title: "DevOps Days 2025",
    slug: "devops-days-2025",
    location: "New York, USA",
    date: "2025-10-14",
    time: "09:30 AM",
  },
];
