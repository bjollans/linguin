import StoryListElement from "linguin-shared/components/story/StoryListElement";
import { StoryText } from "linguin-shared/model/translations";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { useAuth } from "linguin-shared/util/auth";
import { useVisibleStoryIds, useUserStoriesRead } from "linguin-shared/util/clientDb";
import { getStoriesByIds } from "linguin-shared/util/serverDb";
import { Div, H2 } from "linguin-shared/components/RnTwComponents";
import { TouchableOpacity, View } from "react-native";

export default function SuggestedStories({ navigation }) {
    const STORY_AMOUNT = 3;

    const auth = useAuth();
    const { data: storyIds, isSuccess: storyIdsLoaded } = useVisibleStoryIds();
    const { data: storiesRead, isSuccess: storiesReadLoaded } = useUserStoriesRead(auth?.user?.uid ?? null);
    const [stories, setStories] = useState<StoryText[]>([]);

    useEffect(() => {
        if (!storyIdsLoaded || !storiesReadLoaded || storyIds.length < 1) return;
        const storyReadIds = storiesRead.map(x => x.storyId);
        const randomIds = storyIds
            .filter(x => !storyReadIds.includes(x.id))
            .sort(() => Math.random() - Math.random()).slice(0, STORY_AMOUNT).map(x => x.id);
        getStoriesByIds(randomIds).then((stories) => {
            setStories(stories);
        });
    }, [storyIdsLoaded, storiesReadLoaded]);

    const captureClick = () => {
        posthog.capture('suggested_stories_click', {
            story_ids: stories.map(x => x.id),
        });
    };

    return (
        <View className="flex flex-col gap-y-4 items-center my-12 mb-24" onTouchStart={captureClick}>
            <H2 className="text-2xl font-bold">Read this next</H2>
            {stories && stories.map((story) => (
                <TouchableOpacity className="bg-white border-b border-gray-200 w-full"
                    onPress={() => navigation.navigate("Story", { storyId: story.id, storyTitle: story.title })}>
                    <StoryListElement key={"suggested-story-" + story.title} story={story} />
                </TouchableOpacity>
            ))}
        </View>
    );

}