module.exports = {
    siteUrl: 'https://www.linguin.co',
    generateRobotsTxt: true,
    exclude: ["https://www.linguin.co/chat"],
    additionalPaths: async (config) => {
        // get urls from "url" field in json returned from "https://linguin.co/api/get-story-pages"
        const stories = await fetch("https://linguin.co/api/get-story-pages");
        const storiesJson = await stories.json();
        const storyUrls = storiesJson.map((story) => story.url);
        return storyUrls;
    }
  }