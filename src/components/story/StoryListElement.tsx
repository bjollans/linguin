import { StoryText } from "model/translations";
import StoryReadCheckBox from "./StoryReadCheckbox";

export interface StoryListElementProps {
    story: StoryText;
}

export default function StoryListElement(props: StoryListElementProps) {
    return (
        <a href={`/story/hi/${props.story.id}`} className="w-full h-full">
            <li key={props.story.title} className="flex px-4 gap-x-4 py-5 hover:bg-slate-100 items-center">
                <img className="w-24 flex-none rounded-full bg-gray-50" src={props.story.previewImageUrl} alt="" />
                <div className="min-w-0">
                    <p className="text-lg font-semibold leading-6 text-gray-900">{props.story.title}</p>
                    <div className="sm:flex items-end justify-between gap-x-8">
                        <div>
                            <div className="flex">
                                <p className="mt-1 mr-1 truncate text-xs leading-5 bold text-gray-500">Words: </p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-400">{props.story.wordCount}</p>
                            </div>
                            <p className="mt-1 truncate italic text-xs leading-5 text-gray-400">{props.story.content.slice(0, 30) + '....'}</p>
                        </div>
                        <StoryReadCheckBox storyId={props.story.id} />
                    </div>
                </div>
            </li>
        </a>
    );
}