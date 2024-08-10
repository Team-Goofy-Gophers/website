import { type ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "next-themes";
import {
  type FunctionComponent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

interface Props {
  children: ReactNode;
}

const SpaceBG: FunctionComponent<Props> = ({ children }) => {
  const { theme, systemTheme } = useTheme();

  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => await loadSlim(engine))
      .then(() => setInit(true))
      .catch((e) => console.log(e));
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color:
          theme === "dark" || (theme === "system" && systemTheme === "dark")
            ? "#09090b"
            : "#ffffff",
      },
      fpsLimit: 60,
      particles: {
        groups: {
          z0000: {
            number: {
              value: 40,
            },
            zIndex: {
              value: 0,
            },
          },
          z2500: {
            number: {
              value: 50,
            },
            zIndex: {
              value: 25,
            },
          },
          z5000: {
            number: {
              value: 70,
            },
            zIndex: {
              value: 50,
            },
          },
          z7500: {
            number: {
              value: 30,
            },
            zIndex: {
              value: 75,
            },
          },
        },
        number: {
          value: 200,
        },
        color: {
          value:
            theme === "dark" || (theme === "system" && systemTheme === "dark")
              ? "#fff"
              : "#000",
          animation: {
            enable: false,
            speed: 20,
            sync: true,
          },
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 1,
        },
        size: {
          value: 3,
        },
        move: {
          angle: {
            value: 10,
            offset: 0,
          },
          enable: true,
          speed: 5,
          direction: "right",
        },
        zIndex: {
          value: 5,
          opacityRate: 0.5,
        },
      },
      style: {
        position: "absolute",
      },
    }),
    [theme, systemTheme],
  );

  return (
    <div className="relative size-full">
      {init && <Particles id="tsparticles" options={options} />}
      <div className="absolute z-10 size-full">{children}</div>
    </div>
  );
};

export default SpaceBG;
