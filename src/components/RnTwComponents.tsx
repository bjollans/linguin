import { View, Text, Image, Platform, TouchableHighlight } from 'react-native';
import { styled } from 'nativewind';


interface DefaultProps {
    children?: React.ReactNode;
    className?: string;
    onMouseLeave?: () => void;
    onClick?: (e: any) => void;
    style?: any;
}

export function Div(props: DefaultProps): JSX.Element {
    if (Platform.OS === 'web') {
        return (
            <div className={props.className}
                onMouseLeave={props.onMouseLeave}
                onClick={props.onClick}
                style={props.style}>
                {props.children}
            </div>
        );
    }
    const StyledView = styled(View, props.className ?? "");
    return (
        <StyledView>
            {props.children}
        </StyledView>
    );
}

export interface AudioProps {
    onEnded: () => void;
    audioRef: React.RefObject<HTMLAudioElement>;
    onTimeUpdate: (e: React.SyntheticEvent<HTMLAudioElement>) => void;
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLAudioElement>) => void;
    src: string;
    alt?: string;
}

export function Audio(props: AudioProps): JSX.Element {
    if (Platform.OS === 'web') {
        return (
            <audio
                onEnded={props.onEnded}
                ref={props.audioRef}
                onTimeUpdate={props.onTimeUpdate}
                onLoadedMetadata={props.onLoadedMetadata}
            >
                <source src={props.src} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        );
    }
    return (<View>TODO</View>);
}

export function Btn(props: DefaultProps): JSX.Element {
    if (Platform.OS === 'web') {
        return (
            <button className={props.className}
                onMouseLeave={props.onMouseLeave}
                onClick={props.onClick}
                style={props.style}>
                {props.children}
            </button>
        );
    }
    const StyledButton = styled(TouchableHighlight, props.className ?? "");
    return (
        <StyledButton onPress={props.onClick}>
            {props.children}
        </StyledButton>
    );
}

export function P(props: DefaultProps): JSX.Element {
    const webElement = <p className={props.className}>{props.children}</p>;
    return _multiplatformTextElement(webElement, props);
}

interface ImgProps {
    className?: string;
    src?: string;
    alt?: string;
}

export function Img({ className, src, alt }: ImgProps): JSX.Element {
    if (Platform.OS === 'web') {
        return (
            <img className={className} src={src} alt={alt} />
        );
    }

    const StyledImage = styled(Image, className ?? "");
    return (
        <StyledImage source={{ uri: src }} alt={alt} />
    );
}

export function Br(): JSX.Element {
    return Platform.OS === 'web' ? <br /> : <Text>{"\n"}</Text>;
}

export function H1(props: DefaultProps): JSX.Element {
    const webElement = <h1 className={props.className}>{props.children}</h1>;
    return _multiplatformTextElement(webElement, props);
}

export function H2(props: DefaultProps): JSX.Element {
    const webElement = <h2 className={props.className}>{props.children}</h2>;
    return _multiplatformTextElement(webElement, props);
}

export function H3(props: DefaultProps): JSX.Element {
    const webElement = <h3 className={props.className}>{props.children}</h3>;
    return _multiplatformTextElement(webElement, props);
}

export function Span(props: DefaultProps): JSX.Element {
    const webElement = <span
        className={props.className}
        onMouseLeave={props.onMouseLeave}
        onClick={props.onClick}>
        {props.children}
    </span>;
    return _multiplatformTextElement(webElement, props);
}

function _multiplatformTextElement(webElement: JSX.Element, props: DefaultProps): JSX.Element {
    if (Platform.OS === 'web') {
        return webElement;
    }
    const StyledText = styled(Text, props.className ?? "");
    return (
        <StyledText>
            {props.children}
        </StyledText>
    );
}