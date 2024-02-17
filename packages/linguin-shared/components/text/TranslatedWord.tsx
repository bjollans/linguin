import { Btn, Span } from "linguin-shared/components/RnTwComponents";
import { StoryIdContext } from "linguin-shared/context/storyIdContext";
import { useReadUsageContext } from "linguin-shared/context/trackReadContext";
import { TermTranslation } from "linguin-shared/model/translations";
import posthog from "posthog-js";
import { useContext, useState, useEffect } from "react";
import TranslatedWordHoverBox from "./TranslatedWordHoverBox";
import { RnSoundContext } from "linguin-shared/context/rnSoundContext";
import { useRnTouchableContext } from "linguin-shared/context/rnTouchableContext";

export interface TranslatedTermProps {
    termTranslation: TermTranslation;
}

export default function TranslatedTerm(props: TranslatedTermProps): JSX.Element {
    const [showTranslation, setShowTranslation] = useState(false);
    const storyId = useContext(StoryIdContext);
    const { onReadUsageEvent } = useReadUsageContext();
    const RnSound = useContext(RnSoundContext);
    const { addToResetterFunctions } = useRnTouchableContext();

    const playRnAudio = () => {
        if (!RnSound) return;
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
        onReadUsageEvent();
        posthog.capture("view_word_translation", {
            vocab: props.termTranslation.text,
            storyId: storyId,
        });
    }

    return (
        <Btn
            onClick={handleClick}
            onMouseLeave={() => setShowTranslation(false)}
            className="cursor-pointer relative mx-0.5 text-2xl underline decoration-dotted hover:text-indigo-500 cursor-pointer">
            {showTranslation && <TranslatedWordHoverBox termTranslation={props.termTranslation} />}
            <Span>
                {props.termTranslation.text}
            </Span>
        </Btn>

    );
}