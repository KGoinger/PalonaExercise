export const case001 = {
  id: "case-001",
  title: "Image-to-Product Recommendation Walkthrough",
  summary:
    "Single static replay case for interviewer review. This is a read-only snapshot of one representative conversation.",
  messages: [
    {
      id: "case-001-user-1",
      role: "user",
      parts: [
        {
          type: "file",
          mediaType: "image/jpeg",
          filename: "sample-upload.jpg",
          url: "https://live.staticflickr.com/65535/53061394844_588c539b9c_b.jpg",
        },
        {
          type: "text",
          text: "which is this",
        },
      ],
    },
    {
      id: "case-001-assistant-1",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "I found **4** relevant options. Top matches are close to your uploaded polo style:\n\n1. **Urban Flex Polo** ($55.00) — closest overall silhouette and collar profile.\n2. **Apex Aero-Wick Tee** ($68.00) — sport-performance fabric with a similar athletic fit.\n3. **Stealth Run Crew** ($38.00) — minimalist technical top with a clean texture.\n\nIf you share your preferred fit (slim/regular), I can narrow this down to one best pick.",
        },
        {
          type: "tool-search_products",
          state: "output-available",
          output: {
            appliedCategory: "tops",
            productIds: [
              "urban-flex-polo",
              "apex-aero-wick-tee",
              "stealth-run-crew",
            ],
          },
        },
      ],
    },
    {
      id: "case-001-user-2",
      role: "user",
      parts: [
        {
          type: "text",
          text: "Compare Apex Aero-Wick Tee and Urban Flex Polo.",
        },
      ],
    },
    {
      id: "case-001-assistant-2",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "Great comparison:\n\n- **Apex Aero-Wick Tee**: Better for high-intensity training, faster moisture transfer, and long-run comfort.\n- **Urban Flex Polo**: Better for mixed use (workout + casual), more versatile styling, and a lower price.\n\n**Quick decision:**\n- Choose **Apex Aero-Wick Tee** if performance is your top priority.\n- Choose **Urban Flex Polo** if you want one shirt for both gym and daily wear.",
        },
      ],
    },
  ],
};
