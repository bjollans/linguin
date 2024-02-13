import { Div, P, Span } from "linguin-shared/components/RnTwComponents";
import WordPlayerButton from "linguin-shared/components/audio/WordPlayerButton";
import { StoryIdContext } from "linguin-shared/context/storyIdContext";
import { useReadUsageContext } from "linguin-shared/context/trackReadContext";
import { TermTranslation } from "linguin-shared/model/translations";
import posthog from "posthog-js";
import { useContext, useState } from "react";

export interface TranslatedTermProps {
    termTranslation: TermTranslation;
}

export default function TranslatedTerm(props: TranslatedTermProps): JSX.Element {
    const [showTranslation, setShowTranslation] = useState(false);
    const storyId = useContext(StoryIdContext);
    const { onReadUsageEvent } = useReadUsageContext();


    const handleClick = () => {
        setShowTranslation(true);
        onReadUsageEvent();
        posthog.capture("view_word_translation", {
            vocab: props.termTranslation.text,
            storyId: storyId,
        });
    }

    return (
        <Span
            onClick={handleClick}
            onMouseLeave={() => setShowTranslation(false)}
            className="cursor-pointer relative mx-0.5 underline decoration-dotted hover:text-indigo-500 cursor-pointer">
            {showTranslation && <Div className="cursor-text absolute bottom-0 left-0">
                <Div className="bg-black whitespace-nowrap flex text-white rounded-lg p-2 items-center space-x-2 mb-6 mx-auto">
                    <WordPlayerButton word={props.termTranslation.text} />
                    <Div>
                        <P>
                            {props.termTranslation.translation}
                        </P>
                        {props.termTranslation.transliteration &&
                            <P className="text-sm italic mx-auto">
                                {props.termTranslation.transliteration}
                            </P>
                        }
                    </Div>
                </Div>
            </Div>}
            <Span>
                {props.termTranslation.text}
            </Span>
        </Span>

    );
}