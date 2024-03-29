import { Btn, Span } from "linguin-shared/components/RnTwComponents";
import { StoryTranslationIdContext } from "linguin-shared/context/storyTranslationIdContext";
import { useReadUsageContext } from "linguin-shared/context/trackReadContext";
import { TermTranslation } from "linguin-shared/model/translations";
import { useContext, useState, useEffect } from "react";
import TranslatedWordHoverBox from "./TranslatedWordHoverBox";
import { RnSoundContext } from "linguin-shared/context/rnSoundContext";
import { useRnTouchableContext } from "linguin-shared/context/rnTouchableContext";
import { useStoryAudioContext } from "linguin-shared/context/storyAudioContext";
import usePostHog from 'linguin-shared/util/usePostHog';
import { Platform } from "react-native";

export interface TranslatedTermProps {
    termTranslation: TermTranslation;
    isHighlighted?: boolean;
}

export default function TranslatedTerm(props: TranslatedTermProps): JSX.Element {
    const posthogClient = usePostHog();
    const [showTranslation, setShowTranslation] = useState(false);
    const [isPlayingStoryAudio, setIsPlayingStoryAudio] = useState(false);
    const storyTranslationId = useContext(StoryTranslationIdContext);
    const { registerReadUsageEvent } = useReadUsageContext();
    const RnSound = useContext(RnSoundContext);
    const { addToResetterFunctions } = useRnTouchableContext();

    const {
        addIsPlayingAudioUpdateFunction,
    } = useStoryAudioContext();

    useEffect(() => {
        addIsPlayingAudioUpdateFunction((isPlayingAudio: boolean) => {
            setIsPlayingStoryAudio(isPlayingAudio);
        });
    }, []);

    const playRnAudio = () => {
        if (!RnSound || isPlayingStoryAudio) return;
        let fileName = "";
        for (let i = 0; i < props.termTranslation.text.length; i++) {
            fileName += props.termTranslation.text.charCodeAt(i) + (i < props.termTranslation.text.length - 1 ? "-" : "");
        }
        const audioSrc = `https://backend.linguin.co/storage/v1/object/public/wordSound/${fileName}.mp3`;
        let rnSound = new RnSound(audioSrc, '', (error) => {
            if (error) return
            rnSound.play();
        });
    }


    const handleClick = () => {
        addToResetterFunctions(() => setShowTranslation(false));
        setShowTranslation(true);
        playRnAudio();
        registerReadUsageEvent();
        posthogClient?.capture("view_word_translation", {
            vocab: props.termTranslation.text,
            storyTranslationId: storyTranslationId,
        });
    }

    return (
        <Btn
            onClick={handleClick}
            onMouseLeave={() => setShowTranslation(false)}
            className="cursor-pointer relative mx-0.5 text-2xl underline decoration-dotted hover:text-indigo-500 cursor-pointer">
            {showTranslation && <TranslatedWordHoverBox termTranslation={props.termTranslation} />}
            <Span className={props.isHighlighted ? "text-cyan-600" : "text-black"}>
                {props.termTranslation.text}
            </Span>
        </Btn>

    );
}