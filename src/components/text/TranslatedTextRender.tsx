import { LanguageIcon, PlayIcon } from '@heroicons/react/24/solid';
import EqualizerIcon from "components/audio/EqualizerIcon";
import { StoryIdContext } from 'context/storyIdContext';
import { OnReadUsageEvent } from 'context/trackReadContext';
import { TermTranslation, TranslatedText } from "model/translations";
import posthog from 'posthog-js';
import { useContext, useState } from "react";
import TranslatedTerm from "./TranslatedWord";

interface TranslatedTextProps {
    translatedText: TranslatedText;
    isHighlighted: boolean;
    isPlayingAudio: boolean;
    hasAudio: boolean;
    onPlayAudio: () => void;
}

export default function TranslatedTextRender(props: TranslatedTextProps): JSX.Element {
    const [showWholeTranslation, setShowWholeTranslation] = useState(false);
    const translatedWords: Array<JSX.Element> = [];
    const storyId = useContext(StoryIdContext);
    const onReadUsageEvent = useContext(OnReadUsageEvent);

    if (props.translatedText.translationJson !== undefined) {
        for (var i = 0; i < props.translatedText.content.length; i++) {
            const termAtThisPosition = JSON.parse(JSON.stringify(props.translatedText.translationJson!.terms.filter((termTranslation: TermTranslation) =>
                termTranslation.position <= i && termTranslation.position + termTranslation.text.length > i
            )));
            if (termAtThisPosition && termAtThisPosition.length > 0) {
                translatedWords.push((<TranslatedTerm termTranslation={termAtThisPosition[0]}/>));
                i = termAtThisPosition[0].position + termAtThisPosition[0].text.length - 1;
            }
            else {
                translatedWords.push(<span>{props.translatedText.content[i]}</span>);
            }
        }
    }

    const handleTranslateClick = () => {
        setShowWholeTranslation(true);
        onReadUsageEvent();
        posthog.capture("view_sentence_translation", {
            storyId: storyId,
        });
    }

    return (<>
        <span className="relative cursor-pointer"
            onMouseLeave={() => setShowWholeTranslation(false)}>
            <div className={showWholeTranslation ? "cursor-text absolute bottom-0 left-0 z-50" : "hidden"}>
                <div className="bg-black text-white rounded-lg p-2 mb-6 w-96 max-w-full mx-auto">
                    <p className="flex">
                        {props.translatedText.translationJson?.wholeSentence?.translation}
                    </p>
                    {props.translatedText.translationJson?.wholeSentence?.transliteration &&
                        <p className="text-sm flex italic mx-auto">
                            {props.translatedText.translationJson?.wholeSentence?.transliteration}
                        </p>
                    }
                </div>
            </div>
            <div className={`relative flex flex-wrap text-2xl items-center ${props.isHighlighted ? "text-cyan-600" : "text-black"}`}>
                <div className="absolute left-0">
                    {props.hasAudio &&
                        (props.isHighlighted
                            && <EqualizerIcon isAnimated={props.isPlayingAudio} onClick={props.onPlayAudio} />
                            || <PlayIcon className="text-slate-100 w-6 h-6" onClick={props.onPlayAudio} />)
                    }
                </div>
                <div className="mx-8 relative">
                    {translatedWords}
                    <button className="hover:bg-slate-200 text-black font-bold py-2 px-2 mx-4 rounded" onClick={handleTranslateClick}>
                        <LanguageIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </span>
    </>
    );
}