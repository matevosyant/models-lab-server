import { Composition, Folder } from "remotion";
import { HelloWorld, helloWorldSchema } from "./HelloWorld";
import {
  Explainer,
  calculateExplainerMetadata,
  type ExplainerProps,
} from "./explainer/Explainer";
import ep01Explainer from "./explainer/episodes/ep01-how-ai-thinks.json";
import { AI_SHORT_DURATION, AiShort, aiShortSchema } from "./shorts/AiShort";
import { ep01 } from "./shorts/episodes/ep01-prompt-formula";
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
      <Folder name="Explainers">
        <Composition
          id="Explainer-ep01"
          component={Explainer}
          durationInFrames={3000}
          fps={30}
          width={1080}
          height={1920}
          calculateMetadata={calculateExplainerMetadata}
          defaultProps={{ episode: ep01Explainer } as ExplainerProps}
        />
      </Folder>
      <Folder name="Shorts">
        <Composition
          id="AiShort-ep01"
          component={AiShort}
          durationInFrames={AI_SHORT_DURATION}
          fps={30}
          width={1080}
          height={1920}
          schema={aiShortSchema}
          defaultProps={ep01}
        />
      </Folder>
    </>
  );
};
