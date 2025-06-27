import { cn } from "@/lib/tailwind";
import { LinkIcon, MailIcon, MapPinIcon } from "lucide-react";
import {
  SiCplusplus,
  SiPython,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";

const ResumePage = () => {
  return (
    <div className="w-full h-screen flex flex-row justify-center bg-stone-200">
      <div
        className={cn(
          "[--cm:calc(100vh/29.7)]",
          "[--font-xl:calc(0.85*var(--cm))]",
          "[--font-lg:calc(0.6*var(--cm))]",
          "[--font-base:calc(0.38*var(--cm))]",
          "[--font-sm:calc(0.33*var(--cm))",
          "[--font-xs:calc(0.28*var(--cm))]",
          "[--text-sm:40px]",
          "w-full h-fit p-[calc(1*var(--cm))]",
          "sm:h-screen sm:p-[calc(1.5*var(--cm))]",
          "md:w-[calc(21*var(--cm))] md:p-[calc(2.5*var(--cm))] md:drop-shadow-lg md:drop-shadow-stone-950/50",
          "bg-stone-50 text-stone-950",
          "text-sm md:text-(length:--font-base)",
          "flex flex-col gap-y-6",
          "*:flex *:flex-col *:gap-y-2",
          "[&_h2]:text-xl sm:[&_h2]:text-(length:--font-lg)",
          "[&_h2]:font-bold [&_h2]:w-full [&_h2]:border-b [&_h2]:border-stone-950",
          "[&_a]:text-blue-600 [&_a]:hover:text-sky-600 [&_a]:transition-all [&_a]:duration-300"
        )}
      >
        <div>
          <h1 className="text-3xl sm:text-(length:--font-xl) font-bold">
            Carl-Adrien Mercey
          </h1>

          <div
            className={cn(
              "flex flex-col",
              "*:flex *:flex-col max-sm:gap-y-1",
              "sm:*:flex-row sm:*:gap-x-1 sm:*:items-baseline",
              "*:*:not-first:text-xs sm:*:*:not-first:text-(length:--font-sm)",
              "*:*:not-first:text-stone-500 *:*:not-first:italic"
            )}
          >
            <p>
              <span>Ingénieur en traitement d'images</span>
              <span>(diplômé d'EPITA en 2022)</span>
            </p>

            <p>
              <span>Développeur fullstack confirmé</span>
              <span>(3&nbsp;ans d'expérience chez Matters Startup Studio)</span>
            </p>
          </div>

          <div
            className={cn(
              "flex flex-row flex-wrap gap-x-4 gap-y-1",
              "text-xs sm:text-(length:--font-sm)",
              "*:flex *:flex-row *:gap-x-1 *:items-center"
            )}
          >
            <p>
              <MapPinIcon size={12} />
              <span>Paris, France</span>
            </p>

            <a href="https://dev.ca-mercey.fr/">
              <LinkIcon size={12} />
              <span>ca-mercey.fr</span>
            </a>

            <a href="mailto:camercey@gmail.com">
              <MailIcon size={12} />
              <span>camercey@gmail.com</span>
            </a>

            <a href="https://www.linkedin.com/in/camercey/">
              <LinkedInLogoIcon />
              <span>Carl-Adrien Mercey</span>
            </a>
          </div>
        </div>

        <div>
          <h2>Expériences</h2>

          <div
            className={cn(
              "grid",
              "grid-cols-1 gap-y-4",
              "max-sm:[&_p]:odd:[&_span]:first:font-bold max-sm:[&_p]:even:-mt-3",
              "sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-2 sm:gap-y-3",
              "[&_p]:flex [&_p]:flex-col",
              "[&_a]:w-fit",
              "[&_p]:odd:*:not-first:text-[10px] sm:[&_p]:odd:*:not-first:text-(length:--font-xs)",
              "[&_p]:odd:*:not-first:text-stone-500"
            )}
          >
            <p>
              <a href="https://matters.tech/">Matters</a>
              <span>CDI</span>
              <span>Sept. 2022 - Aujourd'hui</span>
            </p>

            <p>
              Développement fullstack dans le cadre de 5&nbsp;projets clients
              (4&nbsp;refontes web et 1&nbsp;backend bancaire), de
              3&nbsp;projets internes (2&nbsp;applications web et un kit de
              développement) et d'études de modernisation de la stack (passage
              de React et Express à NextJS, de Ant Design à TailwindCSS et
              comparaison d'outils).
            </p>

            <p>
              <a href="https://zythogora.com/">Zythogora</a>
              <span>Projet personnel</span>
              <span>Juin 2019 - Aujourd'hui</span>
            </p>

            <p>
              Zythogora est une application de critique de bières. La première
              version date de 2019 et était codée en PHP. L'app a ensuite été
              réécrite en VueJS (2021) puis en React (2022) avec un backend
              FastAPI (Python). En 2025, j'ai pris un congé sabbatique pour la
              professionnaliser en la reprenant de zéro (fonctionnalités,
              design, code) et en la développant en NextJS.
            </p>

            <p>
              <a href="https://www.dxo.com/">DxO Labs</a>
              <span>Stage de fin d'études</span>
              <span>Fév. 2022 - Août 2022</span>
            </p>

            <p>
              Étude de l'état de l'art sur la création de panoramas pour
              intégration dans un logiciel de développement photos,
              développement d'un PoC, intégration de la solution dans la
              pipeline existante du logiciel.
            </p>

            <p>
              <a href="https://atos.net/">Atos</a>
              <span>Stage de tronc commun</span>
              <span>Sept. 2020 - Fév. 2021</span>
            </p>

            <p>
              Participation au développement d'une plateforme de déploiement sur
              supercalculateurs à destination de data scientists. Étude de
              nouveaux cas d'utilisation de cette plateforme et développement
              d'un PoC.
            </p>

            <p>
              <a href="https://www.mega.com/">MEGA International</a>
              <span>Stage</span>
              <span>Juin 2018 - Déc. 2018</span>
            </p>

            <p>
              Développement d'outils de gestion interne en C# et Powershell.
              Développement d'un portail web en ASP.NET pour donner accès à des
              données de l'entreprise.
            </p>
          </div>
        </div>

        <div
          className={cn(
            "[&>div]:flex [&>div]:flex-col [&>div]:gap-y-1",
            "sm:[&>div]:flex-row sm:[&>div]:gap-x-2 sm:[&>div]:items-baseline",
            "[&_h3]:font-semibold [&_h3]:text-nowrap",
            "[&_ul]:flex [&_ul]:flex-row [&_ul]:flex-wrap [&_ul]:gap-1 [&_ul]:items-baseline",
            "[&_li]:text-[10px] sm:[&_li]:text-(length:--font-xs)",
            "[&_li]:font-mono [&_li]:text-stone-600 [&_li]:border [&_li]:border-stone-300 [&_li]:rounded-md [&_li]:px-2 [&_li]:py-1 [&_li]:flex [&_li]:flex-row [&_li]:gap-x-1 [&_li]:items-center",
            "[&_li]:[&_svg]:size-2.5 [&_li]:[&_svg]:text-stone-600"
          )}
        >
          <h2>Compétences et centres d'intérêt</h2>

          <div>
            <h3>Programmation</h3>

            <ul>
              <li>TypeScript</li>

              <li>Python</li>

              <li>SQL</li>

              <li>Bash</li>

              <li>C++</li>

              <li>C#</li>
            </ul>
          </div>

          <div>
            <h3>Développement web</h3>

            <ul>
              <li>
                <SiTypescript />
                <span>NextJS</span>
              </li>

              <li>
                <SiTypescript />
                <span>React</span>
              </li>

              <li>
                <SiTypescript />
                <span>Express</span>
              </li>

              <li>
                <SiPython />
                <span>FastAPI</span>
              </li>
            </ul>
          </div>

          <div>
            <h3>Traitement d'images</h3>

            <ul>
              <li>
                <SiCplusplus />
                <span>OpenCV</span>
              </li>

              <li>
                <SiPython />
                <span>Scikit-learn</span>
              </li>

              <li>
                <SiPython />
                <span>NumPy</span>
              </li>

              <li>
                <SiPython />
                <span>TensorFlow</span>
              </li>
            </ul>
          </div>

          <div>
            <h3>Langues</h3>

            <ul>
              <li>Français (Natif)</li>

              <li>Anglais (TOEIC 975/990)</li>
            </ul>
          </div>

          <div>
            <h3>Centres d'intérêt</h3>

            <ul>
              <li>Photographie</li>

              <li>Musique</li>

              <li>Zythologie</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
