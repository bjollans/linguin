import { Br } from "linguin-shared/components/RnTwComponents";
import TranslatedTextRender from "linguin-shared/components/text/TranslatedTextRender";
import { useStoryAudioContext } from "linguin-shared/context/storyAudioContext";
import { AudioSentenceTime, StoryText, TermTranslation, TranslationJson } from "linguin-shared/model/translations";
import { useState, useEffect } from "react";

export interface StoryTextRenderProps {
    story: StoryText;
}

export default function StoryTextRender(props: StoryTextRenderProps): JSX.Element {
    const [currentAudioTime, setCurrentAudioTime] = useState(-1);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const {
        updateIsPlayingAudio,
        addIsPlayingAudioUpdateFunction,
        updateAudioTimes,
        addAudioTimeUpdateFunction
    } = useStoryAudioContext();


    useEffect(() => {
        addIsPlayingAudioUpdateFunction((isPlayingAudio: boolean) => {
            setIsPlayingAudio(isPlayingAudio);
        });
        addAudioTimeUpdateFunction((audioTime: number) => {
            setCurrentAudioTime(audioTime);
        });
    }, []);

    const lines = props.story.content.split("\n");
    var nonSentenceLinesSeen = 0;
    const lineToTranslatedTextRender = (line: string) => {
        if (line === "") {
            nonSentenceLinesSeen += 1;
            return (<Br />);
        }
        const linePositionStart = props.story.content.indexOf(line)!;
        const linePositionEnd = linePositionStart + line.length;
        const lineIndex = lines?.indexOf(line)!;
        const lineTranslationJson: TranslationJson = {
            terms: props.story.translationJson?.terms.filter((termTranslation: TermTranslation) =>
                termTranslation.position >= linePositionStart && termTranslation.position + termTranslation.text.length <= linePositionEnd
            ).map((termTranslation: TermTranslation) => {
                const termTranslationCopy = JSON.parse(JSON.stringify(termTranslation))
                termTranslationCopy.position -= linePositionStart;
                return termTranslationCopy;
            }) ?? [],
            wholeSentence: props.story.translationJson?.sentences?.find((sentence: TermTranslation) => sentence.position == lineIndex)
        };
        const lineAudioSentenceTime: AudioSentenceTime | undefined = props.story.audioSentenceTimes ? props.story.audioSentenceTimes[lineIndex - nonSentenceLinesSeen] : undefined;
        const audioStartTime = lineAudioSentenceTime ? lineAudioSentenceTime.start : 0;
        const audioEndTime = lineAudioSentenceTime ? lineAudioSentenceTime.end : 0;
        return (<TranslatedTextRender translatedText={{ content: line, translationJson: lineTranslationJson }}
            isHighlighted={currentAudioTime >=0 && currentAudioTime < audioEndTime - 0.0001 && currentAudioTime >= audioStartTime - 0.0001}
            isPlayingAudio={isPlayingAudio} hasAudio={props.story.audioUrl !== null && props.story.audioUrl !== undefined}
            onPlayAudio={() => { updateAudioTimes(audioStartTime - 0.00001); updateIsPlayingAudio(true) }} />);
    };

    return (<>{props.story.content.split("\n").map(lineToTranslatedTextRender)}</>);
}