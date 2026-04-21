export type Module = {
  id: string;
  title: string;
  deck: string;
  duration: string;
  videoUrl: string;
  locked?: boolean;
  body: string[];
};

export const modules: Module[] = [
  {
    id: "ai-command-center",
    title: "AI Command Center",
    deck: "Build the operating system for research, offers, scripting, and execution.",
    duration: "42 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    body: [
      "Your first asset is a repeatable command center. Build prompts for market scanning, offer mapping, content briefs, and daily execution.",
      "Keep every output tied to a buyer, a problem, and a measurable action. AI is leverage only when the system produces decisions."
    ]
  },
  {
    id: "faceless-content-engine",
    title: "Faceless Content Engine",
    deck: "Create authority without becoming the face of the brand.",
    duration: "55 min",
    videoUrl: "https://player.vimeo.com/video/824804225",
    body: [
      "Pick one content lane: proof, pain, process, or perspective. Build repeatable formats and let the asset carry the authority.",
      "Use voiceover, screen capture, kinetic text, product shots, and curated visuals to create presence without personal exposure."
    ]
  },
  {
    id: "monetization-blueprint",
    title: "Monetization Blueprint",
    deck: "Turn attention into offers, checkout paths, and retention loops.",
    duration: "61 min",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    body: [
      "A monetization system starts before the sales page. Segment intent, collect leads, make the offer specific, and remove decision drag.",
      "Use a one-time core offer, a focused upsell, and a post-purchase path that gets the buyer moving immediately."
    ]
  },
  {
    id: "execution-protocol",
    title: "Execution Protocol",
    deck: "Daily schedule, scorecard, and review cadence for disciplined builders.",
    duration: "37 min",
    videoUrl: "https://player.vimeo.com/video/824804225",
    body: [
      "Discipline is an environment, not a mood. Define the input, time block the execution, and review the output without drama.",
      "Track the few numbers that matter: content shipped, leads captured, offers made, revenue collected, and lessons completed."
    ]
  }
];

export const defaultTestimonials = [
  {
    name: "Marcus V.",
    image_url: "https://i.pravatar.cc/160?img=12",
    result: "Built a faceless lead funnel and booked his first 11 buyers in 21 days.",
    rating: 5
  },
  {
    name: "Elena R.",
    image_url: "https://i.pravatar.cc/160?img=32",
    result: "Turned AI research into 30 days of faceless posts and a paid digital offer.",
    rating: 5
  },
  {
    name: "Drew K.",
    image_url: "https://i.pravatar.cc/160?img=15",
    result: "Launched a $97 playbook without recording his face or building a personal brand.",
    rating: 5
  }
];
