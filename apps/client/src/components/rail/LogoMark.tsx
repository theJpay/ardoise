import ArdoiseLogo from "@assets/ardoise-logo.svg?react";

type LogoMarkProps = {
    size?: number;
    className?: string;
};

function LogoMark({ size = 24, className }: LogoMarkProps) {
    return <ArdoiseLogo aria-hidden="true" className={className} height={size} width={size} />;
}

export default LogoMark;
