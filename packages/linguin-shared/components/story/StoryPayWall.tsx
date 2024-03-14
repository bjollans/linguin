import PricingSection from "linguin-shared/components/PricingSection";
import { Div, H3, P } from "linguin-shared/components/RnTwComponents";
import { StoryText } from "linguin-shared/model/translations";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { useAuth } from "linguin-shared/util/auth";
import { useUserStoriesReadAutomatic, useUserStoriesReadAutomaticLast7Days } from "linguin-shared/util/clientDb";

export interface StoryPayWallProps {
    story: StoryText;
    isPayWallOpen: boolean;
    setIsPayWallOpen: (isPayWallOpen: boolean) => void;
}

export default function StoryPayWall({ story, isPayWallOpen, setIsPayWallOpen }: StoryPayWallProps): JSX.Element {
    const auth = useAuth();
    const { data: userStoriesRead } = useUserStoriesReadAutomatic(auth?.user?.uid ?? null);
    const { data: userStoriesReadLast7Days } = useUserStoriesReadAutomaticLast7Days(auth?.user?.uid ?? null);

    const [freeStoriesPerWeek, setFreeStoriesPerWeek] = useState(3);

    useEffect(() => {
        const lateMonetization = posthog.getFeatureFlag('monetization_after_2_stories') === 'test';
        setFreeStoriesPerWeek(lateMonetization ? 5 : 3);
    }, []);

    useEffect(() => {
        const isSubscribed = !!(auth?.user?.planIsActive);
        const userStoriesReadCountLast7Days = new Set(userStoriesReadLast7Days?.map(x => x.storyId) ?? []).size;
        const currentStoryAlreadyRead = userStoriesRead?.map(x => x.storyId).includes(story.id);
        setIsPayWallOpen(isSubscribed || currentStoryAlreadyRead || (userStoriesReadCountLast7Days ?? 0) < freeStoriesPerWeek);
    }, [userStoriesReadLast7Days, userStoriesRead, auth?.user?.planIsActive]);

    useEffect(() => {
        if (!isPayWallOpen) {
            posthog?.capture('story_blocked', {
                story_id: story.id,
                story_title: story.title,
                story_target_language: story.targetLanguage,
            });
        }
    }, [isPayWallOpen]);

    if (isPayWallOpen) return (<></>);

    return (
        <Div className="flex justify-center absolute w-full z-10 h-full backdrop-blur-sm bg-white bg-opacity-60">
            <Div className="rounded-lg p-4 mx-auto">
                <H3 className="text-black text-4xl max-w-lg tracking-tight text-center font-bold mb-4  mx-auto">
                    You have reached your free weekly limit of {freeStoriesPerWeek} stories
                </H3>
                <Div className="mx-auto bg-white shadow-2xl rounded-3xl ring-1 ring-gray-900/10 p-10 my-12">
                    <P className="text-2xl">Keep Reading for Free in Our Android App</P>
                    <Div className="max-w-xs mx-auto">
                        <a onClick={() => posthog.capture("android_link_click")} href='https://play.google.com/store/apps/details?id=com.bjolly.linguin&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' /></a>
                    </Div>
                </Div>
            </Div>
        </Div>
    );
}