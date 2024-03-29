"use client";

import { StoriesAvailableContext, useStoriesAvailable } from "linguin-shared/context/rnStoriesAvailableContext";
import { Br, Div, P } from "linguin-shared/components/RnTwComponents";
import { useAuth } from "linguin-shared/util/auth";
import { useUserStoriesRead, userWordsSeen } from "linguin-shared/util/clientDb";
import { SubscribedContext, useSubscribedContext } from "linguin-shared/context/subscribedContext";
import { Platform } from "react-native";
import { CheckIcon } from "linguin-shared/components/Icons";
import { useContext } from "react";

export default function UserStatistics() {
    const auth = useAuth();
    const { data: wordsSeenJson } = userWordsSeen(auth?.user?.uid);
    const { data: storiesRead } = useUserStoriesRead(auth?.user?.uid);
    const storiesAvailableContext = useContext(StoriesAvailableContext);
    const subscribedContext = useContext(SubscribedContext)
    const wordsSeen = wordsSeenJson?.length > 0 && wordsSeenJson[0] ? wordsSeenJson[0]?.wordsSeen : [];

    return <Div className="mt-1 mb-2">
        <P className="mx-auto text-center text-md italic leading-6 font-medium text-gray-900">
            {storiesRead?.length ?? 0} Stories Read. {wordsSeen?.length} Words Seen.
        </P>
        {Platform.OS !== "web" && !(subscribedContext!.subscribed) && storiesAvailableContext!.storiesAvailableLoaded && <P className="mx-auto text-center text-xs italic leading-6 font-medium text-gray-900">
            {storiesAvailableContext!.storiesAvailable} Free Stories Left.
        </P>}
        {Platform.OS !== "web" && (subscribedContext!.subscribed) && <P className="mx-auto text-center text-xs italic leading-6 font-medium text-gray-900">
            <CheckIcon/> Unlimited Stories Available
        </P>}
    </Div>;
}