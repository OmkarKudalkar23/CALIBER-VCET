import { extractGistWithLLM } from '../../gemini';
import { countTokens } from '../ingestion/parser';

export interface GeneratedGist {
  id: string;
  gist: string;
  structuredData: {
    entities: string[];
    relationships: string[];
    dates: string[];
    numbers: string[];
  };
  tokenCount: number;
}

export async function generateGistForChunk(
  chunkId: string,
  chunkText: string
): Promise<GeneratedGist> {
  const extracted = await extractGistWithLLM(chunkText);
  return {
    id: `GIST-${chunkId}`,
    gist: extracted.gist,
    structuredData: {
      entities: extracted.entities || [],
      relationships: extracted.relationships || [],
      dates: extracted.dates || [],
      numbers: extracted.numbers || []
    },
    tokenCount: countTokens(extracted.gist)
  };
}
