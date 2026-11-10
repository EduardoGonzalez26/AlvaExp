import type {SourceId} from "./types";

export const SOURCES: Record<SourceId, {url: string}> = {
  D1: {
    url: "https://data.worldbank.org/indicator/SP.POP.TOTL?locations=ZJ"
  },
  D2: {
    url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=ZJ"
  },
  D3: {
    url: "https://hdl.handle.net/11362/90154"
  },
  D11: {
    url: "https://data.worldbank.org/indicator/IT.NET.USER.ZS?locations=ZJ"
  }
};
