import { round } from "lodash-es";
import { useEffect, type FC } from "react";
import { getHashedGenerator } from "~/utils/math/hashRand";

type MixtapeProps = {
  id: string;
  tiny?: boolean;
  highPerformance?: boolean;
};

type MixtapeDisplayDecisions = {
  hue: number;
  generator: (step: number) => number;
  colorVariants: number;
  totalBlobs: number;
  duration: number;
  blur: boolean;
};

const Blob: FC<{
  settings: MixtapeDisplayDecisions;
  index: number;
}> = ({ settings, index }) => {
  // every time generate is called use generator with key and a step
  const generate = (step: number) => settings.generator(index + step);

  const variantGroupSize = round(settings.totalBlobs / settings.colorVariants);
  const variantGroup = Math.floor(index / variantGroupSize);

  // if the group is 0, then the hue is the same as the original
  // for each group ontop of that shift to a new color that would be next to the original
  const hueShift = 30;
  const baseHue = settings.hue + hueShift * variantGroup;

  // generate a random hue that is close to the base hue (within 30 degrees)
  const hueRange = 12;
  const hue = Math.floor(baseHue + generate(0) * hueRange - hueRange / 2);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        // generate a random color using generator and the hue
        backgroundColor: `hsl(${hue}, ${Math.floor(generate(0) * 50) + 50}%, ${
          Math.floor(generate(1) * 70) + 30
        }%)`,
        position: "absolute",
        // generate random position where the center can even reach the edge
        top: `${Math.floor(generate(2) * 200) - 100}%`,
        left: `${Math.floor(generate(3) * 200) - 100}%`,
        borderRadius: "50%",
        filter: settings.blur ? "blur(1rem)" : undefined,
      }}
    />
  );
};

export const MixtapeCoverDesign: FC<MixtapeProps> = ({
  id,
  tiny,
  highPerformance,
}) => {
  const generator = getHashedGenerator(id);

  const displayDecisions: MixtapeDisplayDecisions = {
    hue: Math.floor(generator(0) * 360),
    generator,
    colorVariants: Math.floor(generator(1) * 3 + 1),
    totalBlobs: tiny ? 3 : Math.floor(generator(2) * 10 + 1) + 10,
    duration: Math.floor(generator(3) * 10 + 1) + 60,
    blur: !highPerformance,
  };

  const cornerTypes = ["rounded-lg"];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        // padding: "1rem",
      }}
      // className="bg-stone-200"
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          // generate a pastel color using generator and the hue
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          // inner dark drop shadow
        }}
        // generate a random corner type
        className={`rounded-lg ${
          cornerTypes[Math.floor(generator(4) * cornerTypes.length)] ?? ""
        } shadow`}
      >
        <div
          // blur everything inside the div by 50px
          style={{
            width: "100%",
            height: "100%",
            // animate spinning in the center
            animation: `spin ${displayDecisions.duration}s ease-in-out infinite`,
            backgroundColor: `hsl(${displayDecisions.hue}, 100%, 90%)`,
          }}
        >
          {
            // generate this 10 times
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            [...Array(displayDecisions.totalBlobs)].map((_, i) => (
              <Blob key={i} index={i} settings={displayDecisions} />
            ))
          }
        </div>
      </div>
    </div>
  );
};
