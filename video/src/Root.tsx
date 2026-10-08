import { Composition } from "remotion";
import { HelloWorld, helloWorldSchema } from "./HelloWorld";

export const RemotionRoot: React.FC = () => {
  return (
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
  );
};
