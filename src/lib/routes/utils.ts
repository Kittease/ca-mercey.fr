import type { Path } from "./index";

/*
 * Adapted from the `generatePath` utility of `react-router`:
 * https://github.com/remix-run/react-router/blob/main/packages/react-router/lib/router/utils.ts
 */

// prettier-ignore
type Regex_az = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";
type Regex_AZ = Uppercase<Regex_az>;
type Regex_09 = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Regex_w = Regex_az | Regex_AZ | Regex_09 | "_";
type ParamNameChar = Regex_w | "-";

type RegexMatchPlus<Char extends string, T extends string> =
  _RegexMatchPlus<Char, T> extends infer Result extends string
    ? Result extends ""
      ? never
      : Result
    : never;

type _RegexMatchPlus<
  Char extends string,
  T extends string,
> = T extends `${infer Head extends Char}${infer Rest}`
  ? `${Head}${_RegexMatchPlus<Char, Rest>}`
  : "";

type Simplify<T> = { [K in keyof T]: T[K] } & {};

type _ParseParams<P extends string> = P extends `${infer L}/${infer R}`
  ? _ParseParams<L> & _ParseParams<R>
  : P extends `:${infer Param}?${string}`
    ? Partial<Record<RegexMatchPlus<ParamNameChar, Param>, string | null>>
    : P extends `:${infer Param}`
      ? Record<RegexMatchPlus<ParamNameChar, Param>, string>
      : Record<never, never>;

type ParseParams<P extends string> = P extends "*"
  ? { "*": string }
  : P extends `${infer Rest}/*`
    ? { "*": string } & ParseParams<Rest>
    : _ParseParams<P>;

export type PathParam<P extends string> = keyof ParseParams<P> & string;

export type PathParams<P extends string> = Simplify<ParseParams<P>>;

type GeneratedSegment<S extends string> = S extends `:${string}` ? string : S;

export type GeneratedPath<P extends string> = P extends
  | `${string}*`
  | `${string}?${string}`
  ? string
  : P extends `${infer L}/${infer R}`
    ? `${GeneratedSegment<L>}/${GeneratedPath<R>}`
    : GeneratedSegment<P>;

const PATH_PARAM_OVERESCAPED: Record<string, string> = {
  "%24": "$",
  "%26": "&",
  "%2B": "+",
  "%2C": ",",
  "%3A": ":",
  "%3B": ";",
  "%3D": "=",
  "%40": "@",
};

const encodePathParam = (value: string) =>
  encodeURIComponent(value).replace(
    /%(?:24|26|2B|2C|3A|3B|3D|40)/g,
    (match) => PATH_PARAM_OVERESCAPED[match] ?? match,
  );

const stringify = (value: unknown) =>
  value == null ? "" : typeof value === "string" ? value : String(value);

export const generatePath = <P extends Path>(
  pattern: P,
  params: PathParams<P> = {} as PathParams<P>,
): GeneratedPath<P> => {
  const path: string = pattern;

  if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
    throw new Error(
      `Route path "${path}" is invalid: the \`*\` character must always follow a \`/\``,
    );
  }

  const prefix = path.startsWith("/") ? "/" : "";

  const segments = path
    .split(/\/+/)
    .map((segment, index, array) => {
      const isLastSegment = index === array.length - 1;

      if (isLastSegment && segment === "*") {
        return stringify(params["*" as keyof typeof params]);
      }

      const keyMatch = segment.match(/^:([\w-]+)(\??)(.*)/);
      if (keyMatch) {
        const [, key, optional, suffix] = keyMatch;
        const param = params[key as keyof typeof params];

        if (optional !== "?" && param == null) {
          throw new Error(`Missing ":${key}" param`);
        }

        return encodePathParam(stringify(param)) + suffix;
      }

      return segment.replace(/\?$/g, "");
    })
    .filter((segment) => !!segment);

  return (prefix + segments.join("/")) as GeneratedPath<P>;
};
