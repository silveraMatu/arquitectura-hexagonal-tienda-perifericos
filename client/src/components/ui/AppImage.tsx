import Image, { type ImageProps } from 'next/image';

/** Thin wrapper over next/image, kept so template components can be reused as-is. */
const AppImage = (props: ImageProps) => <Image sizes="100vw" {...props} />;

export default AppImage;
