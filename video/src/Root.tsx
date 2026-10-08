import { Composition } from "remotion";
import { HelloWorld, helloWorldSchema } from "./HelloWorld";
import {
  Slideshow,
  calculateSlideshowMetadata,
  slideshowSchema,
} from "./Slideshow";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={helloWorldSchema}
        defaultProps={{
          title: "Models Lab",
          subtitle: "Made with Remotion",
          color: "#4f46e5",
        }}
      />
      <Composition
        id="Slideshow"
        component={Slideshow}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={slideshowSchema}
        calculateMetadata={calculateSlideshowMetadata}
        defaultProps={{
          images: [
            "images/sample-1.jpg",
            "images/sample-2.jpg",
            "images/sample-3.jpg",
          ],
          secondsPerImage: 3,
          transitionSeconds: 0.5,
        }}
      />
    </>
  );
};
