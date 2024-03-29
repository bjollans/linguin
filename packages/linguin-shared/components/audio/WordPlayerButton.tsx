import { StoryTranslationIdContext } from "linguin-shared/context/storyTranslationIdContext";
import { useContext, useMemo, useRef } from "react";
import { Platform } from "react-native";
import { Btn, Div } from "linguin-shared/components/RnTwComponents";
import { PlayCircleIcon } from "linguin-shared/components/Icons";
import usePostHog from 'linguin-shared/util/usePostHog';

export interface WordPlayerButtonProps {
    word: string;
}

export default function WordPlayerButton({ word }: WordPlayerButtonProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const storyTranslationId = useContext(StoryTranslationIdContext);
    const audioSrc = useMemo(() => {
        let fileName = "";
        for (let i = 0; i < word.length; i++) {
            fileName += word.charCodeAt(i) + (i < word.length - 1 ? "-" : "");
        }
        return `https://backend.linguin.co/storage/v1/object/public/wordSound/${fileName}.mp3`;
    }, [word]);
    const posthogClient = usePostHog();

    const play = () => {
        if (Platform.OS == "web") {
            if (audioRef.current) {
                audioRef.current.play();
                posthogClient?.capture("play_word_sound", {
                    vocab: word,
                    storyTranslationId: storyTranslationId,
                });
            }
        }
    };

    return (<Div>
        {Platform.OS == "web" && <audio ref={audioRef}>
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>}
        <Btn className="word-player-button" onClick={play}>
            <PlayCircleIcon />
        </Btn>
    </Div>);
}